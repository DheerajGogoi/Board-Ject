const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: {
        type: String //request/feedback
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    },
    notification: {
        type: String
    },
    accepted: {
        type: Boolean
    },
    pending: {
        type: Boolean
    },
    proj_id: {
        type: String
    }
}, {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;