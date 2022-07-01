import { lazy } from 'react';

const Login = lazy(()=>import('../screens/Login/Login'));
const Register = lazy(()=>import('../screens/Register/Register'));
const Calendar = lazy(()=>import('../screens/Calendar/Calendar'));
const Chats = lazy(()=>import('../screens/Chats/Chats'));
const Projects = lazy(()=>import('../screens/Projects/Projects'));
const Stats = lazy(()=>import('../screens/Stats/Stats'));
const ProjectPage = lazy(()=>import('../screens/ProjectPage/ProjectPage'));
const ForgotPass = lazy(()=>import('../screens/Forgot_Pass/ForgotPass'))
const MyAccount = lazy(()=>import('../screens/MyAccount/MyAccount'));
const AddFriend = lazy(()=>import('../screens/AddFriend/AddFriend'));
const Notifications = lazy(()=>import('../screens/Notifications/Notifications'));

export const login_routes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/forgot_password',
        component: ForgotPass
    }
]

export const general_routes = [
    {
        path: '/projects',
        component: Projects
    },
    {
        path: '/projects/:id',
        component: ProjectPage
    },
    {
        path: '/chats',
        component: Chats
    },
    {
        path: '/stats',
        component: Stats
    },
    {
        path: '/calendar',
        component: Calendar
    },
    {
        path: '/account',
        component: MyAccount
    },
    {
        path: '/add-friend',
        component: AddFriend
    },
    {
        path: '/notifications',
        component: Notifications
    },
]