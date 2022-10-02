import './Stats.scss'
import React, { useEffect, useState } from 'react';
import { Button, LinearProgress, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';
import SideNav from '../../components/SideNav/SideNav';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { ApiRoute } from '../../Util';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const all_status = ["No-Status", "In-Progess", "Completed"];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const years = [
    2021,
    2022,
    2023,
    2024,
    2025,
    2026
]

function Stats() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [allProj, setAllProj] = useState([]);
    const [allProjStats, setAllProjStats] = useState([]);
    const [monthStats, setMonthStats] = useState([]);

    useEffect(() => {
        const fetch = () => {
            setIsLoading(true)
            axios.get(ApiRoute('/project/get_projects_stats/'+user_cred.email), {
                headers: {
                    'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
                }
            })
            .then(result => {
                result = result.data;
                setAllProj(result);

                let no_status_count = 0;
                let pending_count = 0;
                let completed_count = 0;
                for(let i=0; i < result.length; i++){
                    if(result[i].status === "No-Status"){
                        no_status_count++;
                    } else if(result[i].status === "Completed"){
                        completed_count++;
                    } else { //In Progress
                        pending_count++;
                    }
                }
                setAllProjStats([
                    {status: 1, no_of_projects: no_status_count},
                    {status: 2, no_of_projects: pending_count},
                    {status: 3, no_of_projects: completed_count}
                ])

                //getting current month stats
                no_status_count = 0;
                pending_count = 0;
                completed_count = 0;
                for(let i=0; i < result.length; i++){
                    const dateString = result[i].due;
                    var dateObj = new Date(dateString);
                    var month = dateObj.getUTCMonth() + 1;
                    var year = dateObj.getUTCFullYear();
        
                    if(month === (new Date()).getUTCMonth() + 1 && year === (new Date()).getUTCFullYear()){
                        if(result[i].status === "No-Status"){
                            no_status_count++;
                        } else if(result[i].status === "Completed"){
                            completed_count++;
                        } else { //In Progress
                            pending_count++;
                        }
                    }
                }
        
                // console.log([
                //     {status: 1, no_of_projects: no_status_count},
                //     {status: 2, no_of_projects: pending_count},
                //     {status: 3, no_of_projects: completed_count}
                // ]);
                setMonthStats([
                    {status: 1, no_of_projects: no_status_count},
                    {status: 2, no_of_projects: pending_count},
                    {status: 3, no_of_projects: completed_count}
                ]);
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
        fetch();
    }, [])

    const [currMonth, setCurrMonth] = useState(months[(new Date()).getUTCMonth()]);
    const handleMonthChange = (event) => {
        setCurrMonth(event.target.value);

        const currMonthIndex = months.indexOf(event.target.value) + 1;

        // console.log(months.indexOf(event.target.value) + 1, currYear);

        let no_status_count = 0;
        let pending_count = 0;
        let completed_count = 0;

        for(let i=0; i < allProj.length; i++){
            const dateString = allProj[i].due;
            var dateObj = new Date(dateString);
            var month = dateObj.getUTCMonth() + 1;
            var year = dateObj.getUTCFullYear();

            if(month === currMonthIndex && year === currYear){
                if(allProj[i].status === "No-Status"){
                    no_status_count++;
                } else if(allProj[i].status === "Completed"){
                    completed_count++;
                } else { //In Progress
                    pending_count++;
                }
            }
        }

        // console.log([
        //     {status: 1, no_of_projects: no_status_count},
        //     {status: 2, no_of_projects: pending_count},
        //     {status: 3, no_of_projects: completed_count}
        // ]);
        setMonthStats([
            {status: 1, no_of_projects: no_status_count},
            {status: 2, no_of_projects: pending_count},
            {status: 3, no_of_projects: completed_count}
        ]);
    };

    const [currYear, setCurrYear] = useState((new Date()).getUTCFullYear());
    const handleYearChange = (event) => {
        setCurrYear(event.target.value);

        // console.log(months.indexOf(currMonth) + 1, event.target.value);

        let no_status_count = 0;
        let pending_count = 0;
        let completed_count = 0;

        for(let i=0; i < allProj.length; i++){
            const dateString = allProj[i].due;
            var dateObj = new Date(dateString);
            var month = dateObj.getUTCMonth() + 1;
            var year = dateObj.getUTCFullYear();

            if(month === months.indexOf(currMonth) + 1 && year === event.target.value){
                if(allProj[i].status === "No-Status"){
                    no_status_count++;
                } else if(allProj[i].status === "Completed"){
                    completed_count++;
                } else { //In Progress
                    pending_count++;
                }
            }
        }

        // console.log([
        //     {status: 1, no_of_projects: no_status_count},
        //     {status: 2, no_of_projects: pending_count},
        //     {status: 3, no_of_projects: completed_count}
        // ]);
        setMonthStats([
            {status: 1, no_of_projects: no_status_count},
            {status: 2, no_of_projects: pending_count},
            {status: 3, no_of_projects: completed_count}
        ]);
    };

    if(isLoading) <LinearProgress />

    return (
        <SideNav tab='Project Stats'>
            <div className='stats'>
                <div className='stats-container container'>
                    <div className='chart-container'>
                        <div className='chart-1'>
                            <div className='header-1'>All Time Project Stats</div>
                            <VictoryChart
                                theme={VictoryTheme.material}
                                domainPadding={50}
                                animate={{duration: 500}}
                                width={500}
                                title='Project Status'
                            >
                                <VictoryAxis
                                    tickValues={[1, 2, 3]}
                                    tickFormat={all_status}
                                />
                                <VictoryAxis
                                    dependentAxis
                                />
                                <VictoryBar
                                    data={allProjStats}
                                    x="status"
                                    y="no_of_projects"
                                />
                            </VictoryChart>
                        </div>
                        <div className='chart-2'>
                            <div className='header-2'>Month and Year wise Stats</div>
                            <div className='month-drop'>
                                <FormControl style={{ minWidth: '120px', marginRight: '2rem' }}>
                                    <Select
                                    value={currMonth}
                                    onChange={handleMonthChange}
                                    style={{
                                        fontSize: '13px'
                                    }}
                                    >
                                        {
                                            months.map((item, index) => {
                                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>

                                <FormControl style={{ minWidth: '120px' }}>
                                    <Select
                                    value={currYear}
                                    onChange={handleYearChange}
                                    style={{
                                        fontSize: '13px'
                                    }}
                                    >
                                        {
                                            years.map((item, index) => {
                                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <VictoryChart
                                theme={VictoryTheme.material}
                                domainPadding={50}
                                animate={{duration: 500}}
                                width={500}
                                title='Project Status'
                            >
                                <VictoryAxis
                                    tickValues={[1, 2, 3]}
                                    tickFormat={all_status}
                                    style={{ tickLabels: { fontSize: 10 } }}
                                />
                                <VictoryAxis
                                    dependentAxis
                                />
                                <VictoryBar
                                    data={monthStats}
                                    x="status"
                                    y="no_of_projects"
                                />
                            </VictoryChart>
                        </div>
                    </div>
                </div>
            </div>
        </SideNav>
    )
}

export default Stats;