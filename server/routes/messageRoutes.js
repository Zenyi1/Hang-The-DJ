// server/routes/messageRoutes.js
const express = require('express');
const Message = require('../models/MessageForm');
const router = express.Router();

// Delete a message
router.delete('/messages/:id', async (req, res) => {
  try {
    const msgId = req.params.id;
    await Message.findByIdAndDelete(msgId);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Export the router
module.exports = router;
