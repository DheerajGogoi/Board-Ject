import React from 'react'

export default function FeedbackNotif({ value }) {
    return (
        <div className='feedback-notif-box'>
            <p className='feedback-title'>{value.notification}</p>
        </div>
    )
}
