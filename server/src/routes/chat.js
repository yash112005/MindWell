const express = require('express');

const router = express.Router();

const {
  getChatHistory,
  sendMessage
} = require('../controllers/chatController');

const { protect } = require('../middleware/auth');



// GET CHAT HISTORY
router.get(
  '/',
  protect,
  getChatHistory
);



// SEND MESSAGE
router.post(
  '/',
  protect,
  sendMessage
);



module.exports = router;