const express = require("express");
const {
  registerController,
  loginController,
  updateController,
  forgetpasswordController,
  resetPasswordController,
  uploadAudioController,
  commentsController,
  deleteRecordingController,
} = require("../controllers/userController");
const Comment = require("../models/commentsModel");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/update", updateController);
router.post("/forgetpassword", forgetpasswordController);
router.post("/resetpassword", resetPasswordController);
router.post("/upload", uploadAudioController);
router.delete("/api/delete-audio/:filename", deleteRecordingController);
router.post("/comments", commentsController);

module.exports = router;
