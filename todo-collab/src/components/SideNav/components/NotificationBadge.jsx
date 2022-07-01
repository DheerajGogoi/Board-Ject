import { makeStyles } from '@material-ui/core';
import React from 'react';
import {format} from 'timeago.js';

const useStyles = makeStyles(() => ({
    date: {
        fontStyle: 'italic',
        color: 'grey',
        fontSize: '13px'
    },
    notifContainer: {
        marginBottom: '1rem'
    }
}))

export default function NotificationBadge(props) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.notifContainer}>
                {props.text}
                <br />
                <span className={classes.date}>{format(props.date)}</span>
            </div>
        </>
        
    )
}
