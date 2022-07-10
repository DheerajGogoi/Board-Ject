const Conversation  = require('../models/conversation.model');
const Message = require('../models/message.model');
const mongoose = require('mongoose');
const db_connect = require('../utils/db_connect');
const { body, validationResult } = require('express-validator');

require("dotenv").config();

exports.add_conversation = (req, res) => {
    db_connect.connect(async ()=>{
        const newConversation = new Conversation({
            members: [...req.body.members],
            project: {
                ...req.body.project
            }
        });
        try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.find_conversation_uid = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const conversation = await Conversation.find({
                members: {
                    $in: [req.params.user_email]
                },
            });
            res.status(200).json(conversation);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.update_conversation_members = (req, res) => {
    db_connect.connect(async () => {
        try {
            const updatedConversation = await Conversation.updateOne({ "project.project_id": req.body.proj_id }, {
                members: req.body.proj_members
            }, {new: true});
            !updatedConversation && res.status(200).json(updatedConversation);

            res.status(200).json(updatedConversation);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error)
        }
    })
}

exports.delete_conversation = (req, res) => {
    db_connect.connect(async () => {
        Conversation.findOne({ "project.project_id": req.body.proj_id })
        .then(result => {
            console.log(result);
            Conversation.findByIdAndDelete(result._id)
            .then(() => {
                console.log("Conversation Deleted");
                Message.deleteMany({ conversationId: result._id })
                .then(() => {
                    console.log("All Messages deleted");
                    res.status(200).json({success: true, message: "Data deleted successfully"});
                })
                .finally(() => {
                    mongoose.connection.close();
                })
            })
        })
        .catch(error => {
            res.status(500).json(error);
        })
    })
}
