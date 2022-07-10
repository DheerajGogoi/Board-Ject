const Message  = require('../models/message.model');
const mongoose = require('mongoose');
const db_connect = require('../utils/db_connect');
const { body, validationResult } = require('express-validator');

require("dotenv").config();

exports.add_message = (req, res) => {
    db_connect.connect(async ()=>{
        const newMessage = new Message(req.body);
        try {
            const savedMessage = await newMessage.save();
            res.status(200).json(savedMessage);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

exports.get_all_messages = (req, res) => {
    db_connect.connect(async ()=>{
        try {
            const allMessages = await Message.find({
                conversationId: req.params.conversationId
            })
            res.status(200).json(allMessages);

            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error);
        }
    })
}

//_id of Conversaton in the convosersationId of Message
exports.delete_message = (req, res) => {
    db_connect.connect(async () => {
        try {
            const deletedMessage = await Message.find({
                conversationId: req.body.convo_id
            })
            if (!deletedMessage) {
                return res.status(404).send();
            }

            res.status(200).json(deletedMessage);
            mongoose.connection.close();
        } catch (error) {
            res.status(500).json(error)
        }
    })
}