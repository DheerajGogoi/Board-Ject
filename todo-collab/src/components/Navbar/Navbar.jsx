import './Navbar.scss'
import React from 'react'
import { Avatar, Button, IconButton } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';

export default function Navbar() {
    const user_cred = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const history = useHistory();

    const openMenu = Boolean(anchorEl);
    const id = openMenu ? 'simple-popover' : undefined;

    return (
        <div className='navbar-box sticky-top'>
            <div className='navbar-items'>
                <IconButton>
                    <NotificationsNoneIcon />
                </IconButton>
            </div>

            <div className='navbar-items'>
                <Button className='menu-btn' onClick={handleOpenMenu}>
                    {user_cred.displayName} <ExpandMoreIcon />
                </Button>

                <Popover
                    id={id}
                    open={openMenu}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography>
                    <div style={{
                        padding: '10px',
                        width: '250px'
                    }}>
                        <List>
                            <ListItem button onClick={()=>history.push('/account')}>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="My Account" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </List>

                        <Button variant='outlined' style={{
                            textTransform: 'none'
                        }} onClick={()=>{
                            dispatch(authActions.logout());
                        }}>
                            Log Out
                        </Button>
                    </div>
                    </Typography>
                </Popover>
            </div>

            <div className='navbar-items'>
                <Avatar alt={user_cred.displayName} src={user_cred.profile ? user_cred.profile : 'aaa'} />
            </div>
        </div>
    )
}
