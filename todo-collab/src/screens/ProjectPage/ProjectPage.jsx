import './ProjectPage.scss';
import 'date-fns';
import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import Navbar from '../../components/Navbar/Navbar';
import { TextField, Backdrop, CircularProgress, Button, IconButton } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { storage } from '../../firebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CreateIcon from '@material-ui/icons/Create';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import SideNav from '../../components/SideNav/SideNav';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ApiRoute } from '../../Util';

const emails = [
    {title: 'dheeraj@gmail.com', id: 1},
    {title: 'dheerajgogoi2@gmail.com', id: 2},
    {title: 'suraj@gmail.com', id: 3},
    {title: 'rupkumargogoi7@gmail.com', id: 4},
    {title: 'csb20028@tezu.ac.in', id: 5},
    {title: 'dheeraj@weadmit.com', id: 6},
    {title: 'gogoi@gmail.com', id: 7}
];

function ProjectPage() {
    const params = useParams();
    const history = useHistory();
    // console.log('Card id: ', params.id);
    const user_cred = useSelector(state => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [changeVal, setChangeVal] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    const [_id, set_Id] = useState('');
    const [project, setProject] = useState({});
    const [projTitle, setProjTitle] = useState('');
    const [projDesc, setProjDesc] = useState('');
    const [projStatus, setProjStatus] = useState('No-Status');
    const [projDue, setProjDue] = useState(new Date());
    const handleDateChange = (date) => {
        setProjDue(date);
        setChangeVal(true);
    };

    const [task, setTask] = useState('');
    const [projTodo, setProjTodo] = useState([]);
    const [localTodo, setLocalTodo] = useState([]);
    const [localComp, setLocalComp] = useState([]);

    const [projAdmins, setProjAdmins] = useState([])

    const addTaskHander = () => {
        if(task.trim() !== ''){
            // setProjTodo(prev => [{ id: Date.now(), task: task }, ...prev]);
            setLocalTodo(prev => [
                {
                    id: Date.now(),
                    task: task
                },
                ...prev
            ])
            setTask('');
            setChangeVal(true)
        }
    }
    const toCheckHandler = (item) => {
        setLocalTodo(localTodo.filter((obj) => obj !== item));
        setLocalComp(prev => [item, ...prev]);
        setChangeVal(true);
    }
    const toUnCheckHandler = (item) => {
        setLocalComp(localComp.filter((obj) => obj !== item));
        setLocalTodo(prev => [item, ...prev]);
        setChangeVal(true);
    }
    const deletePendingTask = (item) => {
        setLocalTodo(localTodo.filter((obj) => obj != item));
        setChangeVal(true);
    }
    const deleteCompletedTask = (item) => {
        setLocalComp(localComp.filter((obj) => obj != item));
        setChangeVal(true);
    }

    const [thumbName, setThumbName] = useState('');
    
    const [localProjThumbFile, setLocalProjThumbFile] = useState(null); //file
    const [projThumbUrl, setProjThumbUrl] = useState(''); //main url
    const [selectThumbUrl, setSelectThumbUrl] = useState(''); //selecting url
    const [localThumbUrl, setLocalThumbUrl] = useState(''); //url
    const [progress, setProgress] = useState(0);
    const [thumbSelected, setThumbSelected] = useState(false);

    const [projUpdating, setProjUpdating] = useState(false);

    const handleThumbChange = (event) => {
        if (event.target.files[0]) {
            // setChangeVal(true);
            setLocalProjThumbFile(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
                // setLocalThumbUrl(e.target.result);
                setSelectThumbUrl(e.target.result);
                // console.log(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    
    const [projMembers, setProjMembers] = useState([
        'dheeraj@gmail.com'
    ]);
    const [projOldMembers, setProjOldMembers] = useState([
        'dheeraj@gmail.com'
    ]);

    const [memberEmail, setMemberEmail] = useState('');

    useEffect(()=>{
        setIsLoading(true);
        const fetchData = () => {
            axios.get(ApiRoute(`/project/find-project/${params.id}`), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((result)=>{
                let response = result.data;
                // console.log('My project', response);
                setProject(response);

                set_Id(response._id);
                setProjTitle(response.name);
                setProjDesc(response.desc);
                setProjStatus(response.status);
                setProjDue(response.due);
                setProjThumbUrl(response.thumbnail);
                setLocalThumbUrl(response.thumbnail);
                setSelectThumbUrl(response.thumbnail);
                setThumbName(response.thumbnailName);
                setProjMembers(response.members);
                setProjOldMembers(response.members);
                // console.log('project members', response.members);
                // setProjTodo(response.todos);
                setLocalTodo(response.todos[0].localTodo);
                setLocalComp(response.todos[0].localComp);
                setProjAdmins(response.project_admins);
            })
            .catch(e => {
                alert(e.message);
            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
        fetchData();
    }, [])

    const checkIfMemberChanged = (oldMem, newMem) => {
        if (oldMem === newMem) return false; //no change
        if (oldMem == null || newMem == null) return false; //no change
        if (oldMem.length !== newMem.length) return true; //length chnaged ==> there is a change

        for (var i = 0; i < oldMem.length; ++i) {
            if (oldMem[i] !== newMem[i]) return true //elements not equal ==> there is a change
        }
        return false; //nothing else => no change
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        //check for empty thumbnail file

        if(localProjThumbFile === null){
            setProjUpdating(true);

            const updateProj = {
                _id: _id,
                name: projTitle,
                desc: projDesc,
                status: projStatus,
                due: projDue,
                thumbnail: localThumbUrl,
                members: projMembers,
                todos: [{
                    localTodo: localTodo,
                    localComp: localComp,
                }],
            };

            // console.log('Project To update', updateProj);
            axios.put(ApiRoute("/project/update/project"), updateProj, {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then(result => {
                let response = result.data;

                setProject(response);
                setProjTitle(response.name);
                setProjDesc(response.desc);
                setProjStatus(response.status);
                setProjDue(response.due);
                setProjThumbUrl(response.thumbnail);
                setLocalThumbUrl(response.thumbnail);
                setSelectThumbUrl(response.thumbnail);
                // setProjMembers(response.members);
                setProjTodo(response.todos);
                setLocalTodo(response.todos[0].localTodo);
                setLocalComp(response.todos[0].localComp);

                setChangeVal(false);
                setSnackOpen(true);

            })
            .catch(e => {
                alert(e.message);
            })
            .finally(()=>{
                setProjUpdating(false);
            })
        } else {
            setProjUpdating(true);
            const imageName = Date.now();
            const uploadTask = storage.ref(`images/${imageName}`).put(localProjThumbFile);
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
                        const updateProj = {
                            _id: _id,
                            name: projTitle,
                            desc: projDesc,
                            status: projStatus,
                            due: projDue,
                            thumbnail: url,
                            thumbnailName: imageName,
                            members: projMembers,
                            todos: [{
                                localTodo: localTodo,
                                localComp: localComp,
                            }],
                        };

                        axios.put(ApiRoute("/project/update/project"), updateProj, {
                            headers: {
                                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                            }
                        })
                        .then(result => {
                            let response = result.data;

                            setProject(response);
                            setProjTitle(response.name);
                            setProjDesc(response.desc);
                            setProjStatus(response.status);
                            setProjDue(response.due);
                            setProjThumbUrl(response.thumbnail);
                            setLocalThumbUrl(response.thumbnail);
                            setSelectThumbUrl(response.thumbnail);
                            setThumbName(response.thumbnailName)
                            // setProjMembers(response.members);
                            setProjTodo(response.todos);
                            setLocalTodo(response.todos[0].localTodo);
                            setLocalComp(response.todos[0].localComp);

                            setChangeVal(false);
                            setSnackOpen(true);
                        })
                        .catch(e => {
                            alert(e.message);
                        })
                        .finally(()=>{
                            setProjUpdating(false);
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
        setLocalProjThumbFile(null);
        // setLocalThumbUrl('');
        // setThumbSelected(false);
        handleModalClose();
    }

    const thumbUpdateHandler = () => {
        // setThumbSelected(true);
        setLocalThumbUrl(selectThumbUrl);
        setChangeVal(true);
        handleModalClose();
    }

    const [isDeletingThumb, setIsDeletingThumb] = useState(false);
    const thumbDeleteHandler = () => {
        setIsDeletingThumb(true);
        var desertRef = storage.ref().child('images/'+thumbName);
        // Delete the file
        desertRef.delete()
        .then(() => {
            setLocalProjThumbFile(null);
            setLocalThumbUrl('');
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

    const handleNav = () => {
        history.goBack();
    }

    // for adding or removing members
    const [addEmailModal, setAddEmailModal] = useState(false);
    const handleEmailModalClose = () => {
        setAddEmailModal(false);
    }

    const handleEmailModalOpen = () => {
        setAddEmailModal(true);
    }

    const [emailSnackOpen, setEmailSnackOpen] = useState(false);

    const handleEmailSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setEmailSnackOpen(false);
        setAddEmailModal(false);
        setToSendEmail('')
    };

    const [toSendEmail, setToSendEmail] = useState('');
    const handleSendInvite = (e) => {
        e.preventDefault();

        const notifBody = {
            sender: user_cred.email,
            receiver: toSendEmail,
            notification: user_cred.displayName + " (" +user_cred.email + ") has invited you to project " + projTitle,
            type: "request",
            accepted: false,
            pending: true,
            proj_id: project._id,
        }

        axios.post(ApiRoute('/api/notifications/send/user/notification'), notifBody, {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then(result => {
            result = result.data;
            // console.log('Notification sent to ' + result.receiver);
            setEmailSnackOpen(true);
        })
        .catch(e => {
            console.log(e);
        })
    };

    const handleRemoveMembers = (item) => {
        // setProjMembers(projMembers.filter((email) => email !== item));
        // setChangeVal(true);
        const body = {
            email: item,
            proj_id: project._id,
            members: project.members
        }

        // console.log(item, project);
        axios.put(ApiRoute('/project/remove/member'), body, {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then(result => {
            let response = result.data;

            setProject(response);
            set_Id(response._id);
            setProjTitle(response.name);
            setProjDesc(response.desc);
            setProjStatus(response.status);
            setProjDue(response.due);
            setProjThumbUrl(response.thumbnail);
            setLocalThumbUrl(response.thumbnail);
            setSelectThumbUrl(response.thumbnail);
            setThumbName(response.thumbnailName);
            setProjMembers(response.members);
            setProjOldMembers(response.members);
            setLocalTodo(response.todos[0].localTodo);
            setLocalComp(response.todos[0].localComp);
            setProjAdmins(response.project_admins);
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    return (
        <SideNav tab='Project Page'>
            <div className='proj-page'>
            <>
                <Backdrop open={isLoading} style={{zIndex: '9999999'}}>
                    <CircularProgress style={{
                        color: 'white'
                    }} />
                </Backdrop>
            </>
            <>
                <Backdrop open={isDeletingThumb} style={{zIndex: '9999999'}}>
                    <CircularProgress style={{
                        color: 'white'
                    }} />
                </Backdrop>
            </>
                <div className='proj-page-container container'>

                    <div className='proj-form-full'>
                        
                        <form className='proj-details-form' autoComplete='off' onSubmit={handleSubmit}>
                            
                            <div className='proj-header'>
                                <div>
                                    <IconButton onClick={handleNav}>
                                        <ArrowBackIcon style={{
                                            color: 'black',
                                            fontSize: '1.5rem'
                                        }} />
                                    </IconButton>
                                </div>
                                <div>
                                    <h1>Project Page</h1>
                                </div>
                            </div>

                            <div className='proj-thumb-box'>
                                {/* {
                                    localThumbUrl &&
                                    <p>Project Thumbnail</p>
                                } */}
                                {
                                    localThumbUrl &&
                                    <img src={localThumbUrl} alt="thumbnail" className='img-fluid thumbnail-img' />
                                }
                                <div className='edit-thumb-btn'>
                                    <Button
                                    variant='contained'
                                    color='primary'
                                    style={{
                                        textTransform: 'none',
                                        backgroundColor: 'black',
                                        fontWeight: 'bolder'
                                    }}
                                    onClick={handleModalOpen}
                                    disableElevation
                                    >
                                        <CreateIcon style={{
                                            fontSize: '18px',
                                            marginRight: '10px'
                                        }} /> Edit thumbnail
                                    </Button>
                                    <br />
                                </div>

                            </div>
                            
                            <div className='input'>
                                <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label='Project Title'
                                value={projTitle}
                                className='input-field'
                                onChange={(e)=>{
                                    setProjTitle(e.target.value);
                                    setChangeVal(true);
                                }}
                                required
                                />
                            </div>

                            <div className='input'>
                                <TextField
                                multiline
                                id="outlined-basic"
                                variant="outlined"
                                label='Project Description'
                                value={projDesc}
                                className='input-field'
                                onChange={(e)=>{
                                    setProjDesc(e.target.value);
                                    setChangeVal(true);
                                }}
                                required
                                />
                            </div>

                            <div className='date-box'>
                                <p>Due date for the project (DD/MM/YYYY)</p>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        format="dd/MM/yyyy"
                                        value={projDue}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>

                            {projAdmins.includes(user_cred.email) && <>
                                <div className='input'>
                                    <Button className='add-more-btn' variant='contained' onClick={() => handleEmailModalOpen()} disableElevation>
                                        Add More Members to Project
                                    </Button>
                                </div>
                            </>}

                            <div className='proj-mem-box'>
                                <p><b>Other Members</b></p>
                                {
                                    projMembers.map((item, index) => {
                                        if(item !== user_cred.email) return (
                                            <span key={index} className="badge badge-secondary proj-mem">{item} {projAdmins.includes(user_cred.email) && <ClearIcon style={{
                                                fontSize: '20px',
                                                marginLeft: '10px',
                                                cursor: 'pointer'
                                            }} onClick={() => handleRemoveMembers(item)} />} </span>
                                        )
                                    })
                                }
                            </div>

                            <div className='task-box' style={{
                                marginBottom: '2rem'
                            }}>
                                <p>Tasks</p>
                                <div className='task-container'>
                                    <div className='task-input'>
                                        <TextField
                                        variant='standard'
                                        value={task}
                                        onChange={e => setTask(e.target.value)}
                                        placeholder='Add task'
                                        className='task-input-field'
                                        />
                                    </div>

                                    <div>
                                        <IconButton onClick={()=>{
                                            addTaskHander();
                                        }}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                </div>

                                <div className='task-list'>
                                    <div className='todo-tasks'>
                                        <p><b>Pending ({localTodo.length})</b></p>
                                        {
                                            localTodo.map((item, index) => {
                                                return(
                                                    <div key={item.id} className='task-box'>
                                                        <div className='task-text'>
                                                            <div>
                                                                <Checkbox
                                                                checked={false}
                                                                onClick={()=>toCheckHandler(item)}
                                                                color='default'
                                                                />
                                                            </div>
                                                            <div className='text'>
                                                                {item.task}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            alignSelf: 'center'
                                                        }}>
                                                            <IconButton onClick={()=>deletePendingTask(item)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='completed-tasks'>
                                        <p><b>Completed ({localComp.length})</b></p>
                                        {
                                            localComp.map((item, index) => {
                                                return(
                                                    <div key={item.id} className='task-box'>
                                                        <div className='task-text'>
                                                            <div>
                                                                <Checkbox
                                                                checked={true}
                                                                onClick={()=>toUnCheckHandler(item)}
                                                                color='default'
                                                                />
                                                            </div>
                                                            <div className='text'>
                                                                {item.task}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            alignSelf: 'center'
                                                        }}>
                                                            <IconButton onClick={()=>deleteCompletedTask(item)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <Button
                            disabled={!changeVal}
                            className='form-btn'
                            type='submit'
                            color='primary'
                            variant='contained'
                            disableElevation
                            >
                                {
                                    projUpdating && <CircularProgress size={24} style={{
                                        color: 'white',
                                    }} />
                                }{
                                    !projUpdating && 'Save'
                                }
                            </Button>

                            <br />

                            <Button variant="contained" color="secondary" onClick={() => {
                                handleRemoveMembers(user_cred.email);
                                handleNav();
                            }} style={{
                                textTransform: 'none',
                                fontWeight: 'bolder'
                            }} disableElevation >
                                Leave Project
                            </Button>

                        </form>
                    </div>
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
                        // onClose={handleModalClose}
                    >
                        <Fade in={openModal}>
                            <div className='proj-thumb-modal'>
                                <div className='add-proj-box'>
                                    <div>
                                        <p className='modal-title'>Choose a project cover photo</p>
                                        <input type="file" onChange={handleThumbChange} />
                                    </div>

                                    <br />
                                    <br />

                                    <div>
                                        {selectThumbUrl && <img src={selectThumbUrl} alt="thumbnail" className='img-fluid' />}

                                        <div className='t-btn-grp'>
                                            <div style={{
                                                display: projThumbUrl === '' ? 'none' : 'block'
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
                                                    Delete Thumbnail
                                                </Button>
                                            </div>

                                            <div style={{
                                                display: selectThumbUrl !== '' ? 'block' : 'none'
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
                            Project updated successfully!
                        </MuiAlert>
                    </Snackbar>
                </>

                {/* for adding or deleteing members */}
                <>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        open={addEmailModal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 200,
                        }}
                        onClose={handleEmailModalClose}
                    >
                        <Fade in={addEmailModal}>
                            <div className='add-mem-modal'>
                                <div>
                                    <div>
                                        <p>Add Project Members</p>

                                        <div>
                                            <form onSubmit={handleSendInvite}>
                                                <div className='input'>
                                                    <TextField
                                                    multiline
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label='Email Address'
                                                    value={toSendEmail}
                                                    className='input-field'
                                                    onChange={(e)=>{
                                                        setToSendEmail(e.target.value);
                                                    }}
                                                    type='email'
                                                    required
                                                    />
                                                </div>

                                                <Button variant='contained' type='submit' className='send-invite-btn' disableElevation>
                                                    Send
                                                </Button>
                                            </form>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </>
                <>
                    <Snackbar
                        open={emailSnackOpen}
                        autoHideDuration={6000}
                        onClose={handleEmailSnackClose}
                    >
                        <MuiAlert
                            onClose={handleEmailSnackClose}
                            severity="success"
                            variant="filled"
                        >
                            Request Sent!
                        </MuiAlert>
                    </Snackbar>
                </>


            </div>
        </SideNav>
    )
}

export default ProjectPage