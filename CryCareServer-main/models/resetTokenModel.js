const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Document will be automatically deleted after 1 hour
  }
});

module.exports = mongoose.model("ResetToken", resetTokenSchema); 