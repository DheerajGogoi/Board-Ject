const router = require('express').Router();
let Notification  = require('../models/notification.model');
const Notif_Controller = require('../controllers/notification.controller');
const { verifyToken } = require('../utils/jwtUtils');
const { body, validationResult } = require('express-validator');

router.post('/add', verifyToken, Notif_Controller.add_notification);
router.post('/send/user/notification', [
    body('type')
        .notEmpty()
        .withMessage("Notification 'TYPE' cannot be empty"),
    body('sender')
        .notEmpty()
        .withMessage("Sender email cannot be empty"),
    body('receiver')
        .notEmpty()
        .withMessage("Receiver email cannot be empty"),
], verifyToken, Notif_Controller.send_user_notification);
router.put('/response', verifyToken, Notif_Controller.response_notificaton);
router.get('/:receiver', verifyToken, Notif_Controller.get_all_notifications);

module.exports = router;