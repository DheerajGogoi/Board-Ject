const router = require('express').Router();
let Conversation  = require('../models/conversation.model');
const Conv_Controllers = require('../controllers/conversation.controller');
const { verifyToken } = require('../utils/jwtUtils');

router.post('/add', verifyToken, Conv_Controllers.add_conversation);
router.get('/:user_email', verifyToken, Conv_Controllers.find_conversation_uid);

module.exports = router;