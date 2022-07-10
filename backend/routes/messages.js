const router = require('express').Router();
let Message  = require('../models/message.model');
const Msg_Controller = require('../controllers/message.controller');
const { verifyToken } = require('../utils/jwtUtils');

router.post('/add', verifyToken, Msg_Controller.add_message);
router.get('/:conversationId', verifyToken, Msg_Controller.get_all_messages);
router.delete('/delete/message', verifyToken, Msg_Controller.delete_message);

module.exports = router;