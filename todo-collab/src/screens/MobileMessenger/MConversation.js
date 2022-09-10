import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MConversation.scss';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default function MConversation({ conversation, currentUser, index }){
    const [user, setUser] = useState(null);
    
    return(
        <ListItem button>
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