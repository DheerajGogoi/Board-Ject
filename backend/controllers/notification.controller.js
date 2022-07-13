const Notification  = require('../models/notification.model');
const Project = require('../models/project.model');
const Conversation  = require('../models/conversation.model');
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

exports.send_user_notification = (req, res) => {
    db_connect.connect(async () => {
        const newNotification = new Notification(req.body);
        try {
            if(req.body.type === "request") {
                console.log("Request notification", req.body);
                
                const savedNotification = await newNotification.save();
                res.status(200).json(savedNotification);
            } else if (req.body.type === "feedback") {
                console.log("Feedback notification", req.body);

                const savedNotification = await newNotification.save();
                res.status(200).json(savedNotification);
            } else {
                res.status(422).json("Please send a 'type' of notification")
            }

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.response_notificaton = (req, res) => {
    db_connect.connect(async () => {
        // console.log("Response", req.body);
        Notification.findByIdAndUpdate(req.body.notif_id, {
            pending: false,
            accepted: req.body.accepted
        }, {new: true})
        .then((response) => {
            // console.log(response);
            if(req.body.accepted) {
                Project.findById(response.proj_id)
                .then(resp => {
                    // console.log(resp);
                    Project.findByIdAndUpdate(resp._id, {
                        members: [...resp.members, response.receiver]
                    }, { new: true })
                    .then(respo => {
                        // console.log('updated project', respo)
                        Conversation.findOneAndUpdate({ "project.project_id": respo._id.toString() }, {
                            members: respo.members
                        }, {new: true})
                        .then((respe) => {
                            console.log("Success", respe);
                            res.status(200).json("Success");
                        })
                        .finally(() => {
                            mongoose.connection.close();
                        })
                    })
                })
            } else {
                const feedBack = new Notification({
                    type: "feedback",
                    sender: response.receiver, //now the receiver will be sending the feeback msg to the sender
                    receiver: response.sender, //sender now will receive feedback from the receiver
                    notification: `${response.receiver} has rejected your request`
                })

                feedBack.save()
                .then(response => {
                    console.log("Feedback sent!!");
                    res.status(200).json(response);
                })
                .finally(() => {
                    mongoose.connection.close();
                })
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
    })
}