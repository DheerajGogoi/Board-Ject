import './SideBar.scss'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { Button, IconButton, StepButton } from '@material-ui/core';
import { links } from './Links';

export default function SideBar() {
    const history = useHistory();
    const [tab, setTab] = useState('Dashboard');
    const handleNavClick = (link, value) => {
        history.push(link);
        setTab(value);
    }
    return (
        <div className='side-bar'>
            <div className='tabs-container'>
                <h1>Todo Collab</h1>

                {
                    links.map(({ path, title, icon }, index) => {
                        return (
                            <div key={index} className={tab === title ? 'btn-box selected' : 'btn-box'} onClick={(e)=>{
                                handleNavClick(path, title)
                            }}>
                                <div className='tab-button'>
                                    {icon}
                                </div>
                                <div className='tab-text'>
                                    {title}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
