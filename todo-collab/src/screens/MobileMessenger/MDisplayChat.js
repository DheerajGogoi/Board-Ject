import React from 'react';
import {format} from 'timeago.js'
import Avatar from '@material-ui/core/Avatar';



export default function MDisplayChat({message, own, sender}){
    return(
        <div className={own ? 'message-box own' : 'message-box'}>
            <div className='avatar'>
                <Avatar alt="Remy Sharp" src=""/>
                <div>
                    <div className='sender_email'>{sender}</div>
                    <div className='message'>{message.text}</div>
                </div>
            </div>
            <p className='message-sent-time'>{format(message.createdAt)}</p>
        </div>
    );
}