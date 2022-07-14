import React from 'react';
import { format } from 'timeago.js';

export default function FeedbackNotif({ value }) {
    return (
        <div className='feedback-notif-box'>
            <div className='feedback-title'>{value.notification}</div>
            <div className='time-ago'>{format(value.createdAt)}</div>
        </div>
    )
}
