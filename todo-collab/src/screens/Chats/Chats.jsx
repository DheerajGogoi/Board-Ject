import './Chats.scss'
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Navbar from '../../components/Navbar/Navbar';
import Messenger from '../Messenger/Messenger';
import SideNav from '../../components/SideNav/SideNav';
import { isMobile } from 'react-device-detect';
import MobileMessenger from '../MobileMessenger/MobileMessenger';

function Chats() {
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);
    // console.log('Current user credentials', user_cred);
    // console.log(isMobile)

    return (
        <SideNav tab='Chats'>
            <div className='chats'>
                <div className='chats-container container'>
                    {
                        !isMobile && <>
                            <p className='inbox-header'>Inbox</p>
                            <Messenger />
                        </>
                    }
                    {
                        isMobile && <>
                            <MobileMessenger />
                        </>
                    }
                </div>
            </div>
        </SideNav>
    )
}

export default Chats;
