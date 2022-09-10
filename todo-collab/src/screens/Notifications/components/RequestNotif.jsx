import { Button } from '@material-ui/core';
import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { format } from 'timeago.js';

export default function RequestNotif({ value, handleAcceptInvite, handleRejectInvite }) {
    // console.log('Notification', value);

    return (
        <div className='req-notif-box'>
            <div className='req-title'>{value.notification}</div>
            <div className='time-ago'>{format(value.createdAt)}</div>
            <div>
                {
                    value.pending === true && value.accepted === false && <>
                        <Button className='resp-btn' variant="contained" color="primary" onClick={() => handleAcceptInvite(value)}>
                            Accept <CheckIcon className='res-icon' />
                        </Button>

                        <Button className='resp-btn' variant="contained" color="secondary"  onClick={() => handleRejectInvite(value)}>
                            Reject <CloseIcon className='res-icon' />
                        </Button>
                    </>
                }
                {
                    value.pending === false && value.accepted === true && <>
                        <Button className='resp-btn' variant="contained" color="primary" disabled>
                            Accepted
                        </Button>
                    </>
                }
                {
                    value.pending === false && value.accepted === false && <>
                        <Button className='resp-btn' variant="contained" color="secondary" disabled>
                            Rejected
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}
