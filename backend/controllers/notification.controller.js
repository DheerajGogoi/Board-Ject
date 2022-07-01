const Notification  = require('../models/notification.model');
const mongoose = require('mongoose');
const db_connect = require('../utils/db_connect');
const { body, validationResult } = require('express-validator');

require("dotenv").config();

exports.add_notification = (req, res) => {
    db_connect.connect(async ()=>{
        const newMessage = new Notification(req.body);
        try {
            const savedNotification = await newMessage.save();
            res.status(200).json(savedNotification);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.get_all_notifications = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const allNotifications = await Notification.find({
                receiver: req.params.receiver
            }).sort({createdAt: -1})
            res.status(200).json(allNotifications);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}