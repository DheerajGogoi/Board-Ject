import './Messenger.scss'
import React, { useState, useEffect, useContext, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import Conversation from './Conversation';
import {format} from 'timeago.js'
import DisplayChat from './DisplayChat';
import {io} from 'socket.io-client'
import { useSelector } from 'react-redux';
import { ApiRoute } from '../../Util';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import SmsIcon from '@material-ui/icons/Sms';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { useHistory } from 'react-router-dom';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
require('dotenv').config();

export default function Messenger(){

    const current_user = useSelector(state => state.auth.currentUser)
    const [conversation, setConversation] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef()
    const scrollRef = useRef();

    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState();

    const history = useHistory();

    useEffect(()=>{
        // console.log('entered');
        socket.current = io('ws://localhost:8900');
        // console.log('socket.current', socket.current);
        socket.current.on('getMessage', (data) => {
            // console.log('message data',data);
            // console.log('arrival message incoming');
            setArrivalMessage({
                sender: data.user_email,
                text: data.text,
                createdAt: Date.now()
            });
        });
    }, [])
    // console.log('Arrival message', arrivalMessage);

    useEffect(()=>{
        // console.log('this is current chat and arrival message', currentChat, arrivalMessage)
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(()=>{
        socket.current.emit('addUser', current_user.email);
        socket.current.on('getUsers', (users) => {
            // console.log('Users', users);
        })
    }, [current_user])

    // console.log('Socket', socket);

    const url = ApiRoute("/api/conversation/"+current_user.email)
    useEffect(()=>{
        const getConversation = async () => {
            setIsloading(true);
            try {
                const res = await axios.get(url, {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                });
                setConversation(res.data);
                // console.log('all conv', res.data);
                setIsloading(false);
                // console.log(res.data);
            } catch (error) {
                console.log(error);;
                // setError(error);
            }
        }
        getConversation();
    }, [current_user.email])

    useEffect(()=>{
        const getMessages = async() => {
            // console.log('this is convo id', currentChat?._id);
            try {
                const res = await axios.get(ApiRoute('/api/messages/'+currentChat?._id), {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                });

                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
    }, [currentChat]);

    const handleMessageSubmit = async() => {
        if(newMessage !== '') {
            const message = {
                sender: current_user.email,
                text: newMessage,
                conversationId: currentChat._id
            }

            const receiver_email = currentChat.members.filter(
                (member) => member !== current_user.email
            );

            // console.log('receiver email', receiver_email);

            socket.current.emit('sendMessage', {
                sender_email: current_user.email,
                receiver_email,
                text: newMessage,
            })

            try {
                const res = await axios.post(ApiRoute('/api/messages/add'), message, {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                });
                setMessages([...messages, res.data]);
                setNewMessage('')
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const goToProject = () => {
        const body = {
            proj_id: currentChat.project.project_id
        }
        axios.get(ApiRoute('/project/find/project/'+currentChat.project.project_id), {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then(result => {
            // console.log(result);
            result = result.data;
            history.push(`/projects/${result.id}`);
        })
        .catch(error => {
            console.log(error);
        })
    }

    // console.log('Messages', messages);
    if (isLoading) return <div><LinearProgress /></div>
    if (error) return <h1>Error!</h1>;

    // console.log('Current chat', currentChat)

    return(
        <div className='chat-full-container'>
            <div className='row'>
                <div className='col-lg-4'>
                    <div className='users-container'>
                        <List>
                        {
                            conversation.map((item, index)=>{
                                if(item.members.length > 1)
                                    return (
                                        <div key={index} onClick={()=>setCurrentChat(item)}>
                                            <Conversation conversation={item} currentUser={current_user} index={index} />
                                        </div>
                                    )
                            })
                        }
                        </List>
                    </div>
                </div>
                <div className='col-lg-8 display-chat-container' style={{display: currentChat ? '' : 'none'}}>
                    {
                        currentChat && <>
                        <div className='current-chat-header'>
                            <div className='current-chat-avatar'>
                                <IconButton onClick={goToProject}>
                                    <AccountTreeIcon />
                                </IconButton>
                            </div>
                            <div className='current-chat-name'>
                                {currentChat.project.project_name}
                            </div>
                        </div>
                        <div className='display-chats'>
                            {
                                messages.map((m, index)=>{
                                    return <div key={index} ref={scrollRef}><DisplayChat sender={m.sender} message={m} own={m.sender === current_user.email}/></div>
                                })
                            }
                        </div>
                        <div className='send-message-container'>
                            <div className='send-message'>
                                <input className='message-textbox' placeholder='Enter your message....' value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} />
                                <IconButton onClick={handleMessageSubmit} disabled={!newMessage}>
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                        </>
                        
                    }
                    
                </div>
            </div>
        </div>
    );
}