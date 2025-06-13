const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add Name"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please add Gender"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add Email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add Password"],
      trim: true,
      min: 6,
      max: 12,
    },
    audioFiles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", User);
