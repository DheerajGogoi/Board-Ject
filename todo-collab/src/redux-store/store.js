import { configureStore, createSlice } from "@reduxjs/toolkit";

let initialAuth = {
    userLoggedIn: JSON.parse(localStorage.getItem("user-cred")) || false,
    currentUser: JSON.parse(localStorage.getItem("user-cred")) || null,
    userDocId: JSON.parse(localStorage.getItem("user-doc-id")) || null,
}

let initalNotif = {
    notifCount: 0,
    allNotifs: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuth,
    reducers: {
        login(state, actions){
            state.userLoggedIn = true;
            state.currentUser = actions.payload.userCred;
            localStorage.setItem('user-logged-in', JSON.stringify(true));
            localStorage.setItem('user-cred', JSON.stringify(actions.payload.userCred));
            localStorage.setItem('user-doc-id', JSON.stringify(actions.payload.userDocId));
            localStorage.setItem('userJWT', JSON.stringify(actions.payload.userJWT));
        },
        logout(state, actions){
            state.userLoggedIn = false;
            state.currentUser = null;
            localStorage.removeItem('user-logged-in');
            localStorage.removeItem('user-cred');
            localStorage.removeItem('user-doc-id');
            localStorage.removeItem('userJWT');
        },
        update_user(state, actions){
            localStorage.setItem('user-cred', JSON.stringify(actions.payload.userCred));
            state.currentUser = actions.payload.userCred;
        }
    }
})

const notifSlice = createSlice({
    name: 'notif',
    initialState: initalNotif,
    reducers: {
        addNotif(state, actions){
            state.allNotifs = [actions.payload.notification, ...state.allNotifs];
            state.notifCount = state.notifCount + 1;
        },
        setNotifications(state, actions){
            state.allNotifs = actions.payload.notifications;
            state.notifCount = actions.payload.notifications.length;
        }
    }
})

export const authActions = authSlice.actions;
export const notifActions = notifSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        notif: notifSlice.reducer
    }
})

export default store;