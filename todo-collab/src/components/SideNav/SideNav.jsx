import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { links } from '../SideBar/Links';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, notifActions } from '../../redux-store/store';
import Popover from '@material-ui/core/Popover';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import { ApiRoute } from '../../Util';
import axios from 'axios';
import NotificationBadge from './components/NotificationBadge';
import { io } from 'socket.io-client'
import { Button } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    avatar: {
        width: '200px',
        height: '200px',
        overflow: 'hidden',
        borderRadius: '50%',
    },
    username: {
        marginTop: '20px',
        // fontWeight: 'bold'
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    header: {
        alignSelf: 'center'
    },
    typography: {
        padding: theme.spacing(2),
    },
    notifIcon: {
        color: 'white'
    },
    notifDesc: {
        textAlign: 'center',
        color: 'grey',
        fontStyle: 'italic',
        fontSize: '14px'
    },
    notifPopOver: {
        // maxWidth: '500px'
    }
}));

function SideNav(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const dispatch = useDispatch();
    const user_cred = useSelector(state => state.auth.currentUser);
    const notifs = useSelector(state => state.notif);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const history = useHistory();

    const [currentTab, setCurrentTab] = useState(
        history.location.pathname === '/projects' ? 'Projects' :
        history.location.pathname === '/chats' ? 'Chats' :
        history.location.pathname === '/stats' ? 'Project Stats' :
        history.location.pathname === '/calendar' ? 'Calendar' :
        history.location.pathname === '/account' ? 'My Account' :
        history.location.pathname === '/notifications' ? 'Notifications' :
        history.location.pathname === '/settings' ? 'Settings' :
        history.location.pathname === '/add-friend' ? 'Add Friend' :
        'Projects'
    )

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [allNotifications, setAllNotifications] = useState([]);
    const [notifBadgeCount, setNotifBadgeCount] = useState(0);

    useEffect(() => {
        axios.get(ApiRoute('/api/notifications/'+user_cred.email), {
            headers: {
                'x-access-token': JSON.parse(localStorage.getItem("userJWT")).token
            }
        })
        .then((result) => {
            result = result.data;
            // console.log('All Notifications', result);
            setAllNotifications(result);
            dispatch(notifActions.setNotifications({
                notifications: result
            }))
            setNotifBadgeCount(0);
            result.map((value, index) => {
                const d1 = new Date();
                const d2 = new Date(value.createdAt);
                const time_dur = d1.getTime() - d2.getTime();
                const date_dur = Math.round(time_dur / (1000 * 3600 * 24));
                if(date_dur < 30){
                    setNotifBadgeCount(prev => prev + 1);
                }
            })
        })
        .catch(e => {
            console.log(e.message);
        })
        .finally(() => {
        })
    }, [])

    // console.log('Notification Badge Count', notifBadgeCount);

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <div>
                <center>
                    <h3><b>Board-Ject</b></h3>
                    <div className={classes.avatar}>
                        <img className='img-fluid' alt={user_cred.displayName} src={user_cred.profile ? user_cred.profile : 'aaa'} style={{width: '200px', height: 'auto'}} />
                    </div>

                    <Typography variant='h6' className={classes.username}>{user_cred.displayName}</Typography>
                </center>
            </div>
            <List>
                    {links.map(({path, title, icon}, index) => (
                        <>
                            <ListItem button key={index} onClick={() => {
                                setCurrentTab(title);
                                if(title === 'Log Out') {
                                    dispatch(authActions.logout());
                                }
                                history.push(path);
                            }} style={{
                                background: currentTab === title ? '#f5f5f5' : 'white'
                            }}>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                {
                                    title === "Notifications" && notifBadgeCount > 0 && <ListItemText primary={`${title} (${notifBadgeCount})`} />
                                }
                                {
                                    title === "Notifications" && notifBadgeCount === 0 && <ListItemText primary={title} />
                                }
                                {
                                    title !== "Notifications" && <ListItemText primary={title} />
                                }
                            </ListItem>
                        </>
                    ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>

                <div className={classes.topBar}>
                    
                    <div style={{ alignSelf: 'center' }}>
                        <Typography variant='h6' className={classes.header}>
                            {props.tab}
                        </Typography>
                    </div>

                    <div style={{ alignSelf: 'center' }}>
                        <IconButton aria-describedby={id} onClick={handleClick}>
                            <Badge badgeContent={notifBadgeCount} color="primary">
                                <NotificationsIcon className={classes.notifIcon} />
                            </Badge>
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            className={classes.notifPopOver}
                        >
                            <Typography className={classes.typography}>
                                {
                                    notifs.allNotifs.map((value, index) => {
                                        const d1 = new Date();
                                        const d2 = new Date(value.createdAt);
                                        const time_dur = d1.getTime() - d2.getTime();
                                        const date_dur = Math.round(time_dur / (1000 * 3600 * 24));
                                        if(date_dur < 30){
                                            return(
                                                <NotificationBadge key={index} text={value.notification} date={value.createdAt} />
                                            )
                                        }
                                    })
                                }
                                <p className={classes.notifDesc}>All Notifications from the last 30 days</p>
                                <Button variant='contained' color='primary' style={{
                                    textTransform: 'none'
                                }} onClick={() => history.push('/notifications')}>See all notifications</Button>
                            </Typography>
                        </Popover>
                    </div>
                </div>

            </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
        <main className={classes.content}>
            <div className={classes.toolbar} />

            {props.children}

        </main>
        </div>
    );
}

SideNav.propTypes = {
  window: PropTypes.func,
};

export default SideNav;