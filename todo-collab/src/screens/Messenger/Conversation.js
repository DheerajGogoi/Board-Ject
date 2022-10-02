import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Conversation.scss';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default function Conversation({ conversation, currentUser, index }){
    const [user, setUser] = useState(null);
    
    return(
        <ListItem button style={{
        }}>
            <div>
                <div><ListItemText>{conversation.project.project_name}</ListItemText></div>
                <div>
                    {
                        conversation.members.map((member, index) => {
                            if(member !== currentUser.email) {
                                return <span className='member-email'>{member}</span>
                            }
                        })
                    }
                </div>
            </div>
        </ListItem>
    );
}