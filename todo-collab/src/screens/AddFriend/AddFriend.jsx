import React, { useState, useEffect } from 'react';
import SideNav from '../../components/SideNav/SideNav';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { db } from '../../firebase';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button, Divider } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { notifActions } from '../../redux-store/store';
import { useDispatch, useSelector } from 'react-redux';

const emails = [
    {title: 'dheeraj@gmail.com', id: 1},
    {title: 'dheerajgogoi2@gmail.com', id: 2},
    {title: 'suraj@gmail.com', id: 3},
    {title: 'rupkumargogoi7@gmail.com', id: 4},
    {title: 'csb20028@tezu.ac.in', id: 5},
    {title: 'dheeraj@weadmit.com', id: 6}
];


export default function AddFriend() {
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);

    const [selectedEmail, setSelectedEmail] = useState({});
    const user_cred = useSelector(state => state.auth.currentUser);

    const dispatch = useDispatch();

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    useEffect(() => {
        const fetch = () => {
            setAllUsers([]);
            setIsLoading(true);
            db.collection('users').get()
            .then(snapshot => {
                snapshot.docs.map(item => {
                    let displayName = item.data().displayName;
                    let email = item.data().email;
                    setAllUsers(prev => [{ displayName, email}, ...prev]);
                })
            })
            .catch(e => {
                console.log(e.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
        fetch();
    }, [])
    
    // console.log(allUsers);

    const handleRequest = () => {
        // console.log('Current selected email is', selectedEmail);
        dispatch(notifActions.addNotif({notification: {
            sender: user_cred.email,
            receiver: selectedEmail,
            notification: `${user_cred.email} sent you a Friend Request!!`
        }}))
        setSnackOpen(true);
    }

    return(
        <SideNav tab='Add Friend'>
            {
                isLoading ? <div><LinearProgress /></div> :
                <>

                    <Autocomplete
                        onChange={(event, value) => setSelectedEmail(value)}
                        id="combo-box-demo"
                        options={allUsers}
                        getOptionLabel={(option) => option.email}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Email" variant="outlined" />}
                    />

                    <Button variant='contained' color='primary' style={{ marginTop: '1.2rem' }} onClick={handleRequest}>Send Request</Button>

                    <>
                        <Snackbar
                            open={snackOpen}
                            autoHideDuration={6000}
                            onClose={handleSnackClose}
                        >
                            <MuiAlert
                                onClose={handleSnackClose}
                                severity="success"
                                variant="filled"
                            >
                                Friend Request Sent successfully!
                            </MuiAlert>
                        </Snackbar>
                    </>
                </>
            }
        </SideNav>
    );
}