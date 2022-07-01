const Conversation  = require('../models/conversation.model');
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
