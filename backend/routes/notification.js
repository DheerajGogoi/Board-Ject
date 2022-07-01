const router = require('express').Router();
let Notification  = require('../models/notification.model');
const Notif_Controller = require('../controllers/notification.controller');
const { verifyToken } = require('../utils/jwtUtils');

router.post('/add', verifyToken, Notif_Controller.add_notification);

router.get('/:receiver', verifyToken, Notif_Controller.get_all_notifications);

module.exports = router;