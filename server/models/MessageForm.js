const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  fanId: { // This can be a simple string ID or something else that identifies the fan
    type: String, // Use String or a more suitable type based on your user identification
  },
  toDJId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DjProfile',
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
