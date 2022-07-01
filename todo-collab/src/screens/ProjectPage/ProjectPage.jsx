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

const emails = [
    {title: 'dheeraj@gmail.com', id: 1},
    {title: 'dheerajgogoi2@gmail.com', id: 2},
    {title: 'suraj@gmail.com', id: 3},
    {title: 'rupkumargogoi7@gmail.com', id: 4},
    {title: 'csb20028@tezu.ac.in', id: 5},
    {title: 'dheeraj@weadmit.com', id: 6}
];

function ProjectPage() {
    const params = useParams();
    const history = useHistory();
    // console.log('Card id: ', params.id);

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
    const [localTodo, setLocalTodo] = useState([])
    const [localComp, setLocalComp] = useState([])

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
                console.log(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    
    const [projMembers, setProjMembers] = useState([
        'dheeraj@gmail.com'
    ]);

    const [memberEmail, setMemberEmail] = useState('');

    useEffect(()=>{
        setIsLoading(true);
        const fetchData = () => {
            axios.get(`http://localhost:8080/project/find-project/${params.id}`, {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then((result)=>{
                let response = result.data;
                console.log('My project', response);
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
                console.log('project members', response.members);
                // setProjTodo(response.todos);
                setLocalTodo(response.todos[0].localTodo);
                setLocalComp(response.todos[0].localComp);
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

    // console.log('Project', {
    //     projTitle: projTitle,
    //     projDesc: projDesc,
    //     projStatus: projStatus,
    //     projDue: projDue,
    //     projThumbUrl: projThumbUrl,
    //     projMembers: projMembers,
    //     projTodo: projTodo,
    // });

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

            console.log('Project To update', updateProj);
            axios.put("http://localhost:8080/project/update/project", updateProj, {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then(result => {
                let response = result.data;

                setProjTitle(response.name);
                setProjDesc(response.desc);
                setProjStatus(response.status);
                setProjDue(response.due);
                setProjThumbUrl(response.thumbnail);
                setLocalThumbUrl(response.thumbnail);
                setSelectThumbUrl(response.thumbnail);
                setProjMembers(response.members);
                // setProjTodo(response.todos);
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

                        axios.put("http://localhost:8080/project/update/project", updateProj, {
                            headers: {
                                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                            }
                        })
                        .then(result => {
                            let response = result.data;

                            setProjTitle(response.name);
                            setProjDesc(response.desc);
                            setProjStatus(response.status);
                            setProjDue(response.due);
                            setProjThumbUrl(response.thumbnail);
                            setLocalThumbUrl(response.thumbnail);
                            setSelectThumbUrl(response.thumbnail);
                            setThumbName(response.thumbnailName)
                            setProjMembers(response.members);
                            // setProjTodo(response.todos);
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
                            
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: '-3.2rem'
                            }}>
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

                            <div style={{
                                marginBottom: '2rem'
                            }}>
                                {
                                    localThumbUrl &&
                                    <p>Project Thumbnail</p>
                                }
                                {
                                    localThumbUrl &&
                                    <img src={localThumbUrl} alt="thumbnail" style={{ width: '700px' }} />
                                }
                                <div style={{
                                    marginTop: '1.2rem'
                                }}>
                                    <Button
                                    variant='contained'
                                    color='primary'
                                    style={{
                                        textTransform: 'none'
                                    }}
                                    onClick={handleModalOpen}
                                    >
                                        <CreateIcon style={{ fontSize: '18px', marginRight: '10px' }} /> Edit thumbnail
                                    </Button>
                                    <br />
                                    {/* <input type="file" onChange={handleThumbChange} /> */}
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

                            <div style={{
                                marginBottom: '2rem'
                            }}>
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
                                        style={{
                                            width: '700px'
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>

                            <div className='input'>
                                
                                <div style={{
                                    width: '700px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* <div>
                                        <TextField
                                        id="standard-basic"
                                        placeholder="Add members through email"
                                        value={memberEmail}
                                        className='input-field'
                                        onChange={(e)=>{
                                            setMemberEmail(e.target.value);
                                        }}
                                        />
                                    </div> */}

                                    <div>
                                        <Autocomplete
                                            id="combo-box-demo"
                                            options={emails}
                                            getOptionLabel={(option) => option.title}
                                            style={{ width: 300 }}
                                            renderInput={(params) => 
                                                <TextField
                                                {...params}
                                                label="Email"
                                                variant="outlined"
                                                value={memberEmail}
                                                />
                                            }
                                            onChange={e => {
                                                console.log(e.target.innerHTML);
                                                setMemberEmail(e.target.innerHTML);
                                            }}
                                        />
                                    </div>

                                    <div style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Button variant='contained' onClick={()=>{
                                            if(memberEmail.trim() !== ''){
                                                if(projMembers.includes(memberEmail)){
                                                    alert('Member already added!!')
                                                } else {
                                                    setProjMembers(prev => [memberEmail, ...prev]);
                                                    setMemberEmail('');
                                                    setChangeVal(true);
                                                }
                                            }
                                        }}>
                                            <AddIcon />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                marginBottom: '2rem',
                                width: '700px'
                            }}>
                                {
                                    projMembers.map((item, index) => {
                                        return (
                                            <span key={index} className="badge badge-secondary" style={{
                                                fontSize: '16px',
                                                fontWeight: 'normal',
                                                padding: '10px',
                                                marginRight: '10px',
                                                marginBottom: '10px'
                                            }}>{item} <ClearIcon style={{
                                                fontSize: '20px',
                                                marginLeft: '10px',
                                                cursor: 'pointer'
                                            }} onClick={()=>{
                                                setProjMembers(projMembers.filter((email) => email !== item));
                                                setChangeVal(true);
                                            }} /></span>
                                        )
                                    })
                                }
                            </div>

                            <div style={{
                                marginBottom: '2rem'
                            }}>
                                <p>Tasks</p>
                                <div style={{
                                    width: '700px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <TextField
                                        variant='standard'
                                        style={{
                                            width: '630px'
                                        }}
                                        value={task}
                                        onChange={e => setTask(e.target.value)}
                                        placeholder='Add task'
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

                                <div style={{
                                    padding: '10px 60px 10px 40px',
                                    maxWidth: '700px',
                                }} className='task-list'>
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
                            >
                                {
                                    projUpdating && <CircularProgress size={24} style={{
                                        color: 'white',
                                    }} />
                                }{
                                    !projUpdating && 'Save'
                                }
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
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                width: '50%',
                                height: '50%',
                                border: '1px solid black',
                                overflowY: 'scroll'
                            }}>
                                <div className='add-proj-box' style={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                    flexDirection: 'column',
                                    minHeight: '100%'
                                }}>
                                    <div style={{
                                        alignSelf: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <p>Choose a project cover photo</p>
                                        <input type="file" onChange={handleThumbChange} />
                                    </div>

                                    <br />
                                    <br />

                                    <div style={{
                                        textAlign: 'center'
                                    }}>
                                        {selectThumbUrl && <img src={selectThumbUrl} alt="thumbnail" style={{ width: '300px' }} />}

                                        <div style={{
                                            display: projThumbUrl === '' ? 'none' : 'block'
                                        }}>
                                            <Button
                                            variant='outlined'
                                            disableElevation
                                            color='primary'
                                            style={{
                                                textTransform: 'none',
                                                marginTop: '2rem'
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
                                            variant='outlined'
                                            disableElevation
                                            color='primary'
                                            style={{
                                                textTransform: 'none',
                                                marginTop: '2rem'
                                            }}
                                            onClick={thumbUpdateHandler}
                                            >
                                                Set Thumbnail
                                            </Button>
                                        </div>

                                        <div>
                                            <Button
                                            variant='outlined'
                                            disableElevation
                                            color='primary'
                                            style={{
                                                textTransform: 'none',
                                                marginTop: '2rem'
                                            }}
                                            onClick={updateThumbCancelHandler}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                    {/* <div style={{
                                        alignSelf: 'center'
                                    }}>
                                        
                                    </div> */}
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
            </div>
        </SideNav>
    )
}

export default ProjectPage