import React from 'react';
import {format} from 'timeago.js'
import Avatar from '@material-ui/core/Avatar';



export default function DisplayChat({message, own}){
    return(
        <div className={own ? 'message-box own' : 'message-box'}>
            <div className='avatar'>
                <Avatar alt="Remy Sharp" src=""/>
                <p className='message'>{message.text}</p>
            </div>
            <p className='message-sent-time'>{format(message.createdAt)}</p>
        </div>
    );
}