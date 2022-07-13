import './Notifications.scss';
import React, { useState, useEffect, useRef } from 'react';
import SideNav from '../../components/SideNav/SideNav';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { db } from '../../firebase';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button, Divider } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ApiRoute } from '../../Util';
import {io} from 'socket.io-client';
import RequestNotif from './components/RequestNotif';
import FeedbackNotif from './components/FeedbackNotif';

export default function Notifications() {
    const user_cred = useSelector(state => state.auth.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [respLoading, setRespLoading] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState('');
    const [arrivalNotification, setArrivalNotification] = useState(null);
    const dispatch = useDispatch();

    const socket = useRef()
    const scrollRef = useRef();

    useEffect(() => {
        setIsLoading(true);
        axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then((result) => {
            result = result.data;
            console.log('All Notifications', result);
            setAllNotifications(result);
        })
        .catch(e => {
            console.log(e.message);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [])

    // useEffect(()=>{
    //     console.log('entered');
    //     socket.current = io('ws://localhost:8900');
    //     console.log('socket.current', socket.current);
    //     socket.current.on('getNotification', (data) => {
    //         console.log('notification data', data);
    //         console.log('arrival notification incoming',);
    //         setArrivalNotification({
    //             sender: data.user_email,
    //             receiver: 'dheeraj@gmail.com',
    //             notification: data.notification
    //         });
    //     });
    // }, [])

    // useEffect(()=>{
    //     console.log('this is arrival notification', arrivalNotification)
    //     arrivalNotification && arrivalNotification.receiver === 'dheeraj@gmail.com' &&
    //     setAllNotifications((prev) => [arrivalNotification, ...prev])
    // }, [arrivalNotification]);

    // useEffect(()=>{
    //     socket.current.emit('addUser', user_cred.email);
    //     socket.current.on('getUsers', (users) => {
    //         console.log('Users', users);
    //     })
    // }, [user_cred])

    // console.log('Socket', socket);

    // const handleNotificationSubmit = async() => {
    //     if(newNotification !== '') {
    //         const notification = {
    //             sender: user_cred.email,
    //             receiver: 'dheeraj@gmail.com',
    //             notification: newNotification,
    //         }

    //         const receiver_email = 'dheeraj@gmail.com'

    //         console.log('receiver email', receiver_email);

    //         socket.current.emit('sendNotification', {
    //             sender_email: user_cred.email,
    //             receiver_email,
    //             notification: newNotification,
    //         })

    //         try {
    //             const res = await axios.post(ApiRoute('/api/notifications/add'), notification, {
    //                 headers: {
    //                     'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
    //                 }
    //             });
    //             arrivalNotification && arrivalNotification.receiver === notification.receiver &&
    //             setAllNotifications([...allNotifications, res.data]);
    //             setNewNotification('')
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }

    const handleAcceptInvite = (value) => {
        console.log("Invite accept", value);
        setRespLoading(true)
        axios.put(ApiRoute('/api/notifications/response'), {
            notif_id: value._id,
            accepted: true
        }, {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then(result => {
            console.log('Invite Accepted');
            axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((response) => {
                response = response.data;
                console.log('All Notifications', response);
                setAllNotifications(response);
            })
            .catch(e => {
                console.log(e.message);
            })
            .finally(() => {
                setRespLoading(false);
            })
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    const handleRejectInvite = (value) => {
        console.log("Invite Reject", value);
        setRespLoading(true)
        axios.put(ApiRoute('/api/notifications/response'), {
            notif_id: value._id,
            accepted: false
        }, {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then(result => {
            console.log('Invite Rejected');
            axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((response) => {
                response = response.data;
                console.log('All Notifications', response);
                setAllNotifications(response);
            })
            .catch(e => {
                console.log(e.message);
            })
            .finally(() => {
                setRespLoading(false);
            })
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    if(isLoading) return <LinearProgress />

    return(
        <SideNav tab='Notifications'>
            {respLoading && <LinearProgress />}
            <h1>Notifications</h1>
            <div>
                {
                    allNotifications.map((value, index) => {
                        if(value.type === 'request') {
                            return(
                                <>
                                    <RequestNotif
                                        value={value}
                                        handleAcceptInvite={handleAcceptInvite}
                                        handleRejectInvite={handleRejectInvite}
                                    />
                                </>
                            );
                        } else {
                            return(
                                <>
                                    <FeedbackNotif value={value} />
                                </>
                            )
                        }
                    })
                }
            </div>
        </SideNav>
    );
}