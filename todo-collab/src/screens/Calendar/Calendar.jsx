import './Calendar.scss'
import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel, ResourceDirective, ResourcesDirective } from '@syncfusion/ej2-react-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import SideNav from '../../components/SideNav/SideNav';
import { ApiRoute } from '../../Util'

function Calendar() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [calendarData, setCalendarData] = useState({});

    useEffect(()=>{
        const getResult = async () => {
            setIsLoading(true);
            try {
                const projects = await axios.get(ApiRoute('/project/get_projects/'+user_cred.email), {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                    }
                });
                
                const proj_data = [];
                projects.data.map((proj, index) => {
                    const obj = {
                        AllDay: true,
                        Id: proj._id,
                        EndTime: new Date(proj.due),
                        StartTime: new Date(proj.due),
                        Subject: proj.name,
                        ResourceId: proj.status === 'No-Status' ? 1 : proj.status === 'In Progress' ? 2 : proj.status === 'Completed' ? 3 : '' 
                    }
                    proj_data.push(obj)
                })

                const new_data = {
                    dataSource: proj_data
                }
                setCalendarData(new_data);
                // console.log('These are the projects', new_data)

                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
                setIsLoading(false);
            }
        }
        getResult();
    }, [])
    // const localData = {
    //     dataSource: [{
    //         EndTime: new Date(2022, 0, 11),
    //         StartTime: new Date(2022, 0, 11),
    //         Subject: "New Project 1"
    //     }]
    // }

    const resourceDataSource = [
        {Name: 'No-Status', Id: 1, Color: '#B8B8B8'},
        {Name: 'In Progress', Id: 2, Color: '#E2E738'},
        {Name: 'Completed', Id: 3, Color: '#3CA72E'},
    ]

    return (
        <SideNav tab='Calendar'>
            <div className='calendar'>
                <div className='calendar-container container'>
                    {
                        isLoading ? 
                        
                        <div><LinearProgress /></div> :
                        
                        <div>
                            <ScheduleComponent currentView='Month' selectedDate={new Date()} eventSettings={calendarData}>
                                <ResourcesDirective>
                                    {/* <ResourceDirective field='ResourceId' dataSource={resourceDataSource}></ResourceDirective> */}
                                </ResourcesDirective>
                                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
                            </ScheduleComponent>
                        </div>
                    }
                </div>
            </div>
        </SideNav>
    )
}

export default Calendar;
