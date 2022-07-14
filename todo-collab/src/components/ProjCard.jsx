import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ApiRoute } from '../Util';

export default function ProjCard({ id, name, desc, status, memebers, due, thumbnail, todos, handleModalOpen, deleteProjectHandler, handleDialogOpen, setProjDelete, item, setNewProj, setPendingProj, setCompletedProj, setIsLoading, project_admins }) {
    const user_cred = useSelector(state => state.auth.currentUser);
    const hisory = useHistory();

    const onClickDelete = () => {
        setProjDelete(item);
        handleDialogOpen();
    }

    const [projStatus, setProjStatus] = useState(status);

    const handleStatusChange = (event) => {
        const new_status = event.target.value;
        setProjStatus(event.target.value);
        const my_project = {...item, status: new_status};

        axios.put(ApiRoute("/project/update/project"), my_project, {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
            .then(result => {
                let response = result.data;

                setIsLoading(true);
                axios.get(ApiRoute(`/project/all/${user_cred.email}`), {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                })
                .then((result)=>{
                    result = result.data;

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

            })
            .catch(e => {
                alert(e.message);
            })
            .finally(()=>{
                setIsLoading(false);
            })
    };

    return (
        <div style={{
            marginBottom: '2rem'
        }}>
        <Card>
            <CardActionArea onClick={()=>hisory.push(`/projects/${id}`)}>
                {thumbnail && <CardMedia
                    style={{
                        height: '100px'
                    }}
                    image={thumbnail}
                />}
                <CardContent>
                <Typography gutterBottom>
                    <b>{name}</b>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {desc.replace(/^(.{100}[^\s]*).*/, "$1") + "\n"}...
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <FormControl style={{ minWidth: '120px' }}>
                    <Select
                    value={projStatus}
                    onChange={handleStatusChange}
                    style={{
                        fontSize: '13px'
                    }}
                    >
                        <MenuItem value={'No-Status'}>No-Status</MenuItem>
                        <MenuItem value={'In Progress'}>In Progress</MenuItem>
                        <MenuItem value={'Completed'}>Completed</MenuItem>
                    </Select>
                </FormControl>
                {project_admins.includes(user_cred.email) && <>
                    <Button size="small" style={{
                        textTransform: 'none',
                        color: 'red'
                    }}
                    onClick={() => onClickDelete()}
                    >
                        Delete Project
                    </Button>
                </>}
            </CardActions>
        </Card>
        </div>
    );
}