import './Stats.scss'
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';
import SideNav from '../../components/SideNav/SideNav';

function Stats() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);
    // console.log('Current user credentials', user_cred);

    return (
        <SideNav tab='Project Stats'>
            <div className='stats'>
                <div className='stats-container container'>
                    <h1>Stats</h1>
                </div>
            </div>
        </SideNav>
    )
}

export default Stats;