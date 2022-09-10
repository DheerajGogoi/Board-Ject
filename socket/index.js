const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json(`Socket server runnig on port ${process.env.SOCKET}`);
})

const io = require('socket.io')(process.env.SOCKET, {
    cors: {
        origin: process.env.APP_URL,
    }
});

let users = [];

const addUser = (user_email, socketId) => {
    !users.some(user => user.user_email === user_email) &&
    users.push({user_email, socketId})
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (sender_email) => {
    return users.filter((user) => user.user_email !== sender_email);
};

io.on('connection', (socket) => {
    //when connect
    console.log('a user connected.');

    //take socketId and userId from user
    socket.on('addUser', (user_email) => {
        addUser(user_email, socket.id);
        io.emit('getUsers', users);
    });

    //send and get message
    socket.on('sendMessage', ({ sender_email, receiver_email, text }) => {
        console.log('sender email', sender_email)
        const users = getUser(sender_email);
        console.log('users for receiving messages', users)
        users.map(user => {
            console.log('sending message....', user);
            io.to(user.socketId).emit('getMessage', {
                user_email: sender_email,
                text,
            });
        })
    });

    //send and get notification
    socket.on('sendNotification', ({ sender_email, receiver_email, notification }) => {
        console.log('sender email', sender_email)
        const users = getUser(sender_email);
        console.log('users for receiving messages', users)
        users.map(user => {
            console.log('sending message....', user);
            io.to(user.socketId).emit('getNotification', {
                user_email: sender_email,
                notification,
            });
        })
    });

    //when disconnect
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});