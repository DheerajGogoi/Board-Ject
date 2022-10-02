import './MyAccount.scss'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar/Navbar';
import { useParams, useHistory } from 'react-router';
import { TextField, Backdrop, CircularProgress, Button, IconButton } from '@material-ui/core';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CreateIcon from '@material-ui/icons/Create';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { storage, db } from '../../firebase';
import { authActions } from '../../redux-store/store';
import SideNav from '../../components/SideNav/SideNav';

const useStyles = makeStyles((theme) => ({
    
}));

export default function MyAccount() {
    const classes = useStyles();

    const dispatch = useDispatch();
    const history = useHistory();
    const user_cred = useSelector(state => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [changeVal, setChangeVal] = useState(false);
    const [accUpdating, setAccUpdating] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    const [displayName, setDisplayName] = useState(user_cred?.displayName);
    const [fName, setFname] = useState(user_cred?.fName);
    const [lName, setLname] = useState(user_cred?.lName);
    const [profile, setProfile] = useState(user_cred?.profile);

    const handleNav = () => {
        history.goBack();
    }

    const [profileName, setProfileName] = useState(user_cred?.profileName);
    
    const [localProfileFile, setLocalProfileFile] = useState(null); //file
    const [profileUrl, setProfileUrl] = useState(user_cred?.profile); //main url
    const [selectProfileUrl, setSelectProfileUrl] = useState(user_cred?.profile); //selecting url
    const [localProfileUrl, setLocalProfileUrl] = useState(user_cred?.profile); //url
    const [progress, setProgress] = useState(0);
    const [thumbSelected, setThumbSelected] = useState(false);

    const handleThumbChange = (event) => {
        if (event.target.files[0]) {
            // setChangeVal(true);
            setLocalProfileFile(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
                // setLocalProfileUrl(e.target.result);
                setSelectProfileUrl(e.target.result);
                // console.log(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        //check for empty thumbnail file

        if(localProfileFile === null || localProfileFile === ''){
            setAccUpdating(true);

            db.collection("users").doc(JSON.parse(localStorage.getItem("user-doc-id"))).update({
                displayName,
                fName,
                lName,
                profile : localProfileUrl,
                profileName: ''
            })
            .then(() => {
                dispatch(authActions.update_user({userCred: {
                    ...user_cred,
                    displayName,
                    fName,
                    lName,
                    profile : localProfileUrl,
                    profileName: ''
                }}))
                
                setChangeVal(false);
                setSnackOpen(true);
            })
            .catch(e => {
                alert(e.message);
            })
            .finally(()=>{
                setAccUpdating(false);
            })

        } else {
            setAccUpdating(true);
            const imageName = Date.now();
            const uploadTask = storage.ref(`images/${imageName}`).put(localProfileFile);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                    .ref()
                    .child('images/'+imageName)
                    .getDownloadURL()
                    .then(url => {

                        db.collection("users").doc(JSON.parse(localStorage.getItem("user-doc-id"))).update({
                            displayName,
                            fName,
                            lName,
                            profile: url,
                            profileName: imageName,
                        })
                        .then(() => {
                            dispatch(authActions.update_user({userCred: {
                                ...user_cred,
                                displayName,
                                fName,
                                lName,
                                profile: url,
                                profileName: imageName,
                            }}))
                            
                            setChangeVal(false);
                            setSnackOpen(true);
                        })
                        .catch(e => {
                            alert(e.message);
                        })
                        .finally(()=>{
                            setAccUpdating(false);
                        })
                    });
                }
            );
        }
    }

    const [openModal, setOpenModal] = useState(false);
    const handleModalOpen = () => {
        setOpenModal(true);
    };
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const updateThumbCancelHandler = () => {
        setLocalProfileFile(null);
        handleModalClose();
    }

    const thumbUpdateHandler = () => {
        setLocalProfileUrl(selectProfileUrl);
        setChangeVal(true);
        handleModalClose();
    }

    const [isDeletingThumb, setIsDeletingThumb] = useState(false);
    const thumbDeleteHandler = () => {
        setIsDeletingThumb(true);
        var desertRef = storage.ref().child('images/'+profileName);
        // Delete the file
        desertRef.delete()
        .then(() => {
            setLocalProfileFile(null);
            setLocalProfileUrl('');
            alert('Thumnail Deleted! Now save your project');
            setChangeVal(true);
        }).catch((error) => {
            console.log(error.message);
        })
        .finally(() => {
            setIsDeletingThumb(false);
            setOpenModal(false); //closing the modal after successfull deletion of the thumbnail
        })
    }

    return (
        <SideNav tab='My Account'>
            <div className='account'>
                <div className='account-container container'>

                    <div className='acc-form-full'>
                        
                        <form className='acc-details-form' autoComplete='off' onSubmit={handleSubmit}>
                            
                            <div className='header-grp'>
                                <div>
                                    <IconButton onClick={handleNav}>
                                        <ArrowBackIcon style={{
                                            color: 'black',
                                            fontSize: '1.5rem'
                                        }} />
                                    </IconButton>
                                </div>
                            </div>

                            {
                                localProfileUrl && <div className='img-grp'>
                                    <img className='img-fluid img-profile' src={localProfileUrl} alt={displayName} />
                                </div>
                            }

                            <div className='profile-btn-grp'>
                                <Button
                                variant='contained'
                                color='primary'
                                style={{
                                    textTransform: 'none',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    fontWeight: 'bolder'
                                }}
                                disableElevation
                                onClick={handleModalOpen}
                                >
                                    <CreateIcon style={{ fontSize: '18px', marginRight: '10px' }} /> Edit Profile Picture
                                </Button>
                                <br />
                            </div>
                            
                            <div className='input-grp'>
                                <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label='Display Name'
                                value={displayName}
                                className='input-field'
                                onChange={(e)=>{
                                    setDisplayName(e.target.value);
                                    setChangeVal(true);
                                }}
                                />
                            </div>

                            <div className='input-grp'>
                                <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label='First Name'
                                value={fName}
                                className='input-field'
                                onChange={(e)=>{
                                    setFname(e.target.value);
                                    setChangeVal(true);
                                }}
                                />
                            </div>

                            <div className='input-grp'>
                                <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label='Last Name'
                                value={lName}
                                className='input-field'
                                onChange={(e)=>{
                                    setLname(e.target.value);
                                    setChangeVal(true);
                                }}
                                />
                            </div>

                            <Button
                            disabled={!changeVal}
                            className='form-btn'
                            type='submit'
                            color='secondary'
                            variant='contained'
                            style={{
                                fontWeight: 'bolder',
                            }}
                            >
                                {
                                    accUpdating && <CircularProgress size={24} style={{
                                        color: 'white',
                                    }} />
                                }{
                                    !accUpdating && 'Save'
                                }
                            </Button>

                        </form>
                    </div>

                    <>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            open={openModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 200,
                            }}
                        >
                            <Fade in={openModal}>
                                <div className='acc-modal'>
                                    <div>
                                        <div>
                                            <p>Choose a Profile Picture</p>
                                            <input type="file" onChange={handleThumbChange} style={{
                                                marginBottom: '2rem'
                                            }} />
                                        </div>

                                        <div>
                                            {selectProfileUrl && <img src={selectProfileUrl} className='img-fluid prof-image' alt="thumbnail" style={{margin: 'auto' }} />}

                                            <div className='p-btn-grp'>
                                                <div style={{
                                                    display: profileUrl === '' ? 'none' : 'block'
                                                }}>
                                                    <Button
                                                    variant='contained'
                                                    disableElevation
                                                    color='primary'
                                                    style={{
                                                        textTransform: 'none',
                                                        backgroundColor: 'black',
                                                        fontWeight: 'bolder',
                                                        color: 'white'
                                                    }}
                                                    onClick={thumbDeleteHandler}
                                                    >
                                                        Delete Photo
                                                    </Button>
                                                </div>

                                                <div style={{
                                                    display: selectProfileUrl !== '' ? 'block' : 'none'
                                                }}>
                                                    <Button
                                                    variant='contained'
                                                    disableElevation
                                                    color='primary'
                                                    style={{
                                                        textTransform: 'none',
                                                        backgroundColor: 'black',
                                                        fontWeight: 'bolder',
                                                        color: 'white'
                                                    }}
                                                    onClick={thumbUpdateHandler}
                                                    >
                                                        Set Thumbnail
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    disableElevation
                                                    color='primary'
                                                    style={{
                                                        textTransform: 'none',
                                                        fontWeight: 'bolder',
                                                        color: 'black'
                                                    }}
                                                    onClick={updateThumbCancelHandler}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fade>
                        </Modal>
                    </>
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
                                Profile updated successfully!
                            </MuiAlert>
                        </Snackbar>
                    </>
                </div>
            </div>
        </SideNav>
    )
}
