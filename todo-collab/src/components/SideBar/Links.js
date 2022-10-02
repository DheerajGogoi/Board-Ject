import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import NotificationsIcon from '@material-ui/icons/Notifications';

export const links = [
    {
        path: '/projects',
        title: 'Projects',
        icon: <>
            <AccountTreeIcon />
        </>
    },
    {
        path: '/chats',
        title: 'Chats',
        icon: <>
            <ChatBubbleOutlineOutlinedIcon />
        </>
    },
    {
        path: '/stats',
        title: 'Project Stats',
        icon: <>
            <EqualizerOutlinedIcon />
        </>
    },
    {
        path: '/calendar',
        title: 'Calendar',
        icon: <>
            <CalendarTodayOutlinedIcon />
        </>
    },
    {
        path: '/account',
        title: 'My Account',
        icon: <>
            <AccountCircleIcon />
        </>
    },
    {
        path: '/notifications',
        title: 'Notifications',
        icon: <>
            <NotificationsIcon />
        </>
    },
    {
        path: '/',
        title: 'Log Out',
        icon: <>
            <ExitToAppIcon style={{
                transform: 'rotate(180deg)'
            }} />
        </>
    },
]