const express = require('express');
const router = express.Router();
const MessageController = require('../Controller/messageController');

router.post('/send', MessageController.sendMessages);
router.get('/messages/location', MessageController.getMessagesByLocation);
router.delete('/:id', MessageController.deleteMessage);

module.exports = router;
