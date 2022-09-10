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
import RequestNotif from './components/RequestNotif';
import FeedbackNotif from './components/FeedbackNotif';

export default function Notifications() {
    const user_cred = useSelector(state => state.auth.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [respLoading, setRespLoading] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then((result) => {
            result = result.data;
            // console.log('All Notifications', result);
            setAllNotifications(result);
        })
        .catch(e => {
            console.log(e.message);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [])

    const handleAcceptInvite = (value) => {
        // console.log("Invite accept", value);
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
            // console.log('Invite Accepted');
            axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((response) => {
                response = response.data;
                // console.log('All Notifications', response);
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
        // console.log("Invite Reject", value);
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
            // console.log('Invite Rejected');
            axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((response) => {
                response = response.data;
                // console.log('All Notifications', response);
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
            {/* <h1>Notifications</h1> */}
            <div className='notif-container'>
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