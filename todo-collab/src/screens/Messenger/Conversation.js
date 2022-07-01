import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Conversation.scss';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default function Conversation({ conversation, currentUser, index }){
    const [user, setUser] = useState(null);

    useEffect(()=>{

        const getUser = async () => {
            try {
                
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [currentUser, conversation]);
    
    return(
        <ListItem button style={{
            // border: '1px solid black',
            // borderBottom: index !== 0 ? '1px solid black' : '',
            // borderBottom: index !== 0 ? '1px solid black' : '',
            borderBottom: '1px solid grey',
        }}>
            <div>
                <div><ListItemText>{conversation.project.project_name}</ListItemText></div>
                <div style={{fontSize: '12px'}}>
                    {
                        conversation.members.map((member, index) => {
                            if(member !== currentUser.email) {
                                return <span>{member} </span>
                            }
                        })
                    }
                </div>
            </div>
        </ListItem>
    );
}