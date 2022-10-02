import './Projects.scss';
import 'date-fns';
import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Backdrop, Button, CircularProgress, Divider, IconButton, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
//icons
import AddIcon from '@material-ui/icons/Add';
import ProjCard from '../../components/ProjCard';
import ClearIcon from '@material-ui/icons/Clear';
import { storage } from '../../firebase';
import SideNav from '../../components/SideNav/SideNav';
import { ApiRoute } from '../../Util';

function Projects() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);

    const [newProj, setNewProj] = useState([]);
    const [pendingProj, setPendingProj] = useState([]);
    const [completedProj, setCompletedProj] = useState([]);

    const [projDelete, setProjDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setProjTitle('');
        setProjDesc('');
        setMemberEmail('');
        setProjMemberse([ user_cred.email ]);
        setProjThumbUrl('');
        setLocalThumb('');
        setProjDate(new Date());
        setProjStatus('No-Status');
        setOpenModal(false);
    };

    const [openDialog, setDialogOpen] = useState(false);
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setProjDelete(null);
    };

    const handleDeleteProject = () => {
        // console.log('Project to be deleted', projDelete);
        setIsDeleting(true);
        if(projDelete.thumbnail === ''){
            axios.delete(ApiRoute(`/project/delete/project/${projDelete._id}`), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((result) => {
                result = result.data;
                // console.log('My projects after deletion', result);

                setNewProj(result.filter((item) => item.status === 'No-Status'));
                setPendingProj(result.filter((item) => item.status === 'In Progress'))
                setCompletedProj(result.filter((item) => item.status === 'Completed'));
            })
            .then(() => {
                //deleting the conversation and the messages of the Project
                axios.delete(ApiRoute('/api/conversation/delete/conversation'), {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    },
                    data: {
                        proj_id: projDelete._id
                    }
                }) 
                .then((resp) => {
                    // console.log(resp);
                })
            })
            .catch((e)=>{
                console.log(e.message);
            })
            .finally(()=>{
                setProjDelete(null);
                setDialogOpen(false);
                setIsDeleting(false);
            })
        } else {
            var desertRef = storage.ref().child('images/'+projDelete.thumbnailName);
            // Delete the file
            desertRef.delete().then(() => {
                // console.log('Thumnail Deleted!');
                
                axios.delete(ApiRoute(`/project/delete/project/${projDelete._id}`), {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                })
                    .then((result) => {
                        result = result.data;
                        // console.log('My projects after deletion', result);

                        setNewProj(result.filter((item) => item.status === 'No-Status'));
                        setPendingProj(result.filter((item) => item.status === 'In Progress'))
                        setCompletedProj(result.filter((item) => item.status === 'Completed'))
                    })
                    .then(() => {
                        //deleting the conversation and the messages of the Project
                        axios.delete(ApiRoute('/api/conversation/delete/conversation'), {
                            headers: {
                                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                            },
                            data: {
                                proj_id: projDelete._id
                            }
                        }) 
                        .then((resp) => {
                            // console.log(resp);
                        })
                    })
                    .catch((e)=>{
                        console.log(e.message);
                    })
                    .finally(()=>{
                        setIsDeleting(false);
                    })
            })
            .catch((error) => {
                console.log(error.message);
            })
            .finally(()=>{
                setProjDelete(null);
                setDialogOpen(false);
                setIsDeleting(false);
            })
        }
    }

    useEffect(()=>{
        const fetchData = () => {
            setIsLoading(true);
            axios.get(ApiRoute(`/project/all/${user_cred.email}`), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((result)=>{
                result = result.data;
                // console.log('My projects', result);

                setNewProj(result.filter((item) => item.status === 'No-Status'));

                setPendingProj(result.filter((item) => item.status === 'In Progress'))

                setCompletedProj(result.filter((item) => item.status === 'Completed'))
            })
            .catch((e)=>{
                console.log(e.message);
            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
        fetchData();
    }, [])

    const [projStatus, setProjStatus] = useState('No-Status')
    const [projTitle, setProjTitle] = useState('');
    const [projDesc, setProjDesc] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [projMembers, setProjMemberse] = useState([
        user_cred.email
    ]);
    const [projThumbUrl, setProjThumbUrl] = useState('');
    const [localThumb, setLocalThumb] = useState('');

    const [progress, setProgress] = useState(0);
    
    const handleThumbChange = (event) => {
        if (event.target.files[0]) {
            setProjThumbUrl(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = (e) => {
                setLocalThumb(e.target.result);
                // console.log(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    
    const [projDate, setProjDate] = useState(new Date());
    const handleDateChange = (date) => {
        setProjDate(date);
    };

    const [projUploading, setProjUploading] = useState(false);

    const handleAddTask = (e) => {
        e.preventDefault();

        if(projThumbUrl === ''){
            setProjUploading(true);
            const newProj = {
                id: Date.now(),
                name: projTitle,
                desc: projDesc,
                members: projMembers,
                status: projStatus,
                due: projDate,
                thumbnail: '',
                thumbnailName: '',
                todos: [{
                    localTodo: [],
                    localComp: []
                }],
                project_admins: [
                    user_cred.email
                ]
            }
            axios.post(ApiRoute('/project/add'), newProj, {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
                .then((result)=>{
                    // console.log(result);
                    if(projStatus === 'No-Status'){
                        setNewProj((prev) => [result.data, ...prev])
                    } else if (projStatus === 'In Progress') {
                        setPendingProj(prev => [result.data, ...prev])
                    } else if (projStatus === 'Completed'){
                        setCompletedProj(prev => [result.data, ...prev])
                    }
                    const conv = {
                        members: projMembers,
                        project: {
                            project_id: result.data._id,
                            project_name: result.data.name
                        }
                    }

                    axios.post(ApiRoute('/api/conversation/add'), conv, {
                        headers: {
                            'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                        }
                    })
                    .then(res => {
                        // console.log('conversation added!!', res.data);
                    })
                    .catch((e)=>{
                        console.log(e.message);
                    })
                })
                .catch((e)=>{
                    console.log(e.message);
                })
                .finally(()=>{
                    setProjUploading(false);

                    handleModalClose();
                })
        } else {
            setProjUploading(true);
            const imageName = Date.now();
            const uploadTask = storage.ref(`images/${imageName}`).put(projThumbUrl);
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
                        const newProj = {
                            id: Date.now(),
                            name: projTitle,
                            desc: projDesc,
                            members: projMembers,
                            status: projStatus,
                            due: projDate,
                            thumbnail: url,
                            thumbnailName: imageName,
                            todos: [{
                                localTodo: [],
                                localComp: []
                            }],
                            project_admins: [
                                user_cred.email
                            ]
                        }

                        axios.post(ApiRoute('/project/add'), newProj, {
                            headers: {
                                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                            }
                        })
                            .then((result)=>{
                                // console.log(result.data);
                                if(projStatus === 'No-Status'){
                                    setNewProj((prev) => [result.data, ...prev])
                                } else if (projStatus === 'In Progress') {
                                    setPendingProj(prev => [result.data, ...prev])
                                } else if (projStatus === 'Completed'){
                                    setCompletedProj(prev => [result.data, ...prev])
                                }

                                const conv = {
                                    members: projMembers,
                                    project: {
                                        project_id: result.data._id,
                                        project_name: result.data.name
                                    }
                                }
                                axios.post(ApiRoute('/api/conversation/add'), conv, {
                                    headers: {
                                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                                    }
                                })
                                    .then(res => {
                                        // console.log('conversation added!!', res.data);
                                    })
                                    .catch((e)=>{
                                        console.log(e.message);
                                    })
                            })
                            .catch((e)=>{
                                console.log(e.message);
                            })
                            .finally(()=>{
                                setProjUploading(false);

                                handleModalClose();
                            })
                    });
                }
            );
        }
    }

    return (
        <SideNav tab='Projects'>
            <div className='projects'>
                <>
                    <Backdrop open={isLoading} style={{zIndex: '9999999'}}>
                        <CircularProgress style={{
                            color: 'white'
                        }} />
                    </Backdrop>
                </>
                <>
                    <Backdrop open={isDeleting} style={{zIndex: '9999999'}}>
                        <CircularProgress style={{
                            color: 'white'
                        }} />
                    </Backdrop>
                </>
                <div className='projects-container container'>
                    {/* <h1>Projects</h1> */}

                    <div className='all-projects-box row'>
                        <div className='col-lg-4'>
                            <p className='proj-type-header no-status'>
                                No-Status
                            </p>

                            <Button 
                            variant='contained'
                            className='proj-add-btn'
                            disableElevation
                            onClick={()=>{
                                handleModalOpen();
                                setProjStatus('No-Status')
                            }}
                            >
                                <AddIcon style={{
                                    fontSize: '17px',
                                    marginRight: '10px'
                                }} /> Add
                            </Button>

                            <div className='proj-cards-container'>
                                {
                                    newProj.map((item, index) => {
                                        return (
                                            <ProjCard
                                                key={item.id}
                                                id={item.id}
                                                name={item.name}
                                                desc={item.desc}
                                                status={item.status}
                                                memebers={item.members}
                                                due={item.due}
                                                thumbnail={item.thumbnail}
                                                todos={item.todos}
                                                handleDialogOpen={handleDialogOpen}
                                                setProjDelete={setProjDelete}
                                                item={item}
                                                setNewProj={setNewProj}
                                                setPendingProj={setPendingProj}
                                                setCompletedProj={setCompletedProj}
                                                setIsLoading={setIsLoading}
                                                project_admins={item.project_admins}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='col-lg-4'>
                            <p className='proj-type-header in-progress'>
                                In Progress
                            </p>

                            <Button 
                            variant='contained'
                            className='proj-add-btn'
                            disableElevation
                            onClick={()=>{
                                handleModalOpen();
                                setProjStatus('In Progress')
                            }}
                            >
                                <AddIcon style={{
                                    fontSize: '17px',
                                    marginRight: '10px'
                                }} /> Add
                            </Button>

                            <div className='proj-cards-container'>
                                {
                                    pendingProj.map((item, index) => {
                                        return (
                                            <ProjCard
                                                key={item.id}
                                                id={item.id}
                                                name={item.name}
                                                desc={item.desc}
                                                status={item.status}
                                                memebers={item.members}
                                                due={item.due}
                                                thumbnail={item.thumbnail}
                                                todos={item.todos}
                                                handleDialogOpen={handleDialogOpen}
                                                setProjDelete={setProjDelete}
                                                item={item}
                                                setNewProj={setNewProj}
                                                setPendingProj={setPendingProj}
                                                setCompletedProj={setCompletedProj}
                                                setIsLoading={setIsLoading}
                                                project_admins={item.project_admins}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='col-lg-4'>
                            <p className='proj-type-header completed'>
                                Completed
                            </p>

                            <Button 
                            variant='contained'
                            className='proj-add-btn'
                            disableElevation
                            onClick={()=>{
                                handleModalOpen();
                                setProjStatus('Completed')
                            }}
                            >
                                <AddIcon style={{
                                    fontSize: '17px',
                                    marginRight: '10px'
                                }} /> Add
                            </Button>

                            <div className='proj-cards-container'>
                                {
                                    completedProj.map((item, index) => {
                                        return (
                                            <ProjCard
                                                key={item.id}
                                                id={item.id}
                                                name={item.name}
                                                desc={item.desc}
                                                status={item.status}
                                                memebers={item.members}
                                                due={item.due}
                                                thumbnail={item.thumbnail}
                                                todos={item.todos}
                                                handleDialogOpen={handleDialogOpen}
                                                setProjDelete={setProjDelete}
                                                item={item}
                                                setNewProj={setNewProj}
                                                setPendingProj={setPendingProj}
                                                setCompletedProj={setCompletedProj}
                                                setIsLoading={setIsLoading}
                                                project_admins={item.project_admins}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
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
                    >
                        <Fade in={openModal}>
                            <div className='modal-content' style={{
                                
                            }}>
                            <>
                                <Backdrop open={projUploading} style={{zIndex: '9999999'}}>
                                    <CircularProgress style={{
                                        color: 'white'
                                    }} />
                                </Backdrop>
                            </>
                                <div className='add-proj-box container' style={{
                                    display: 'block',
                                    margin: 'auto'
                                    // textAlign: 'center'
                                }}>
                                    <p className='create-title' style={{
                                        fontSize: '1.4rem',
                                        fontWeight: 'bolder'
                                    }}>Create New Project</p>
                                    <form onSubmit={handleAddTask} autoComplete='off' style={{
                                        display: 'inline-block',
                                        textAlign: 'left',
                                        width: '100%'
                                    }}>
                                        
                                        <div style={{
                                            marginBottom: '2rem'
                                        }}>
                                            <TextField
                                                id="standard-basic"
                                                placeholder="Project Title"
                                                value={projTitle}
                                                onChange={(e)=>setProjTitle(e.target.value)}
                                                style={{
                                                    // width: '500px'
                                                    width: '100%'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div style={{
                                            marginBottom: '2rem'
                                        }}>
                                            <TextField
                                                multiline
                                                id="standard-basic"
                                                placeholder="Project Description"
                                                value={projDesc}
                                                onChange={(e)=>setProjDesc(e.target.value)}
                                                style={{
                                                    // width: '500px'
                                                    width: '100%'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div style={{
                                            marginBottom: '2rem'
                                        }}>
                                            <p>Due date for the project</p>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    id="date-picker-dialog"
                                                    format="dd/MM/yyyy"
                                                    value={projDate}
                                                    onChange={handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    style={{
                                                        // width: '500px'
                                                        width: '100%'
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>

                                        <div style={{
                                        }}>
                                            <p>Choose a project cover photo</p>
                                            <input type="file" onChange={handleThumbChange} style={{
                                                    // width: '500px'
                                                    width: '100%'
                                                }} />

                                            <br />
                                            <br />

                                            {localThumb && <img src={localThumb} alt="thumbnail" style={{ width: '300px' }} />}

                                        </div>

                                        <Divider />

                                        <Button
                                        variant='contained'
                                        type='submit'
                                        disableElevation
                                        style={{
                                            marginTop: '2rem',
                                            textTransform: 'none',
                                            backgroundColor: 'black',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            float: 'right'
                                        }}
                                        >
                                            Save Project
                                        </Button>
                                        
                                        <Button
                                        onClick={handleModalClose}
                                        style={{
                                            marginRight: '1.2rem',
                                            marginTop: '2rem',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            float: 'right'
                                        }}
                                        >
                                            Cancel
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </>

                <>
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        PaperComponent={Paper}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                            Delete
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the project ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteProject} style={{
                                color: 'red'
                            }}>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>

                
            </div>
        </SideNav>
    )
}

export default Projects;
