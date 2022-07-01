import './Home.scss'
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';

function Home() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);
    // console.log('Current user credentials', user_cred);
    const handleLogOut = () => {
        dispatch(authActions.logout());
    }
    return (
        <div className='home'>
            <div className='home-container container'>
                <Navbar />
                <h1>Home</h1>
            </div>
        </div>
    )
}

export default Home;
