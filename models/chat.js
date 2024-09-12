const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  message: {
    type: String,
  },

  created_at: {
    type: Date,
  },
});

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat
