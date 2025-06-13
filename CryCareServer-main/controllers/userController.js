const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const sendResetEmail = require("../utils/sendResetEmail");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const Comment = require("../models/commentsModel");
const ResetToken = require("../models/resetTokenModel");

// Register
const registerController = async (req, res) => {
  try {
    const { name, gender, email, password } = req.body;
    if (!name || !gender || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }
    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be greater than or equal to 6 characters!",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "This email is already registered",
      });
    }

    const hashedpassword = await hashPassword(password);
    const user = await userModel({
      name,
      gender,
      email,
      password: hashedpassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Register Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.status(200).send({
      success: true,
      token,
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

// Update
const updateController = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(404).send({
        success: false,
        message: "User not found or password not set",
      });
    }

    if (oldPassword) {
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "Old password is incorrect",
        });
      }
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password should be at least 6 characters long",
      });
    }

    const hashedNewPassword = newPassword
      ? await hashPassword(newPassword)
      : user.password;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedNewPassword,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).send({
        success: false,
        message: "Failed to update user",
      });
    }

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile Updated",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in update API",
      error: error.message || error,
    });
  }
};

// Forget Password
const forgetpasswordController = async (req, res) => {
  const { email } = req.body;

  async function generateCode(length) {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found with this email address.",
      });
    }

    // Delete any existing reset tokens for this user
    await ResetToken.deleteMany({ userId: user._id });

    const token = await generateCode(32); // Using a longer token for better security
    
    // Create new reset token
    await ResetToken.create({
      userId: user._id,
      token: token
    });

    await sendResetEmail(email, token);
    return res.status(200).send({
      success: true,
      message: "Password reset instructions have been sent to your email",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

// Reset Password
const resetPasswordController = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    if (!email || !token || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, token, and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Find the reset token
    const resetToken = await ResetToken.findOne({
      userId: user._id,
      token: token
    });

    if (!resetToken) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Delete the used token
    await ResetToken.deleteOne({ _id: resetToken._id });

    return res.status(200).send({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    return res.status(500).send({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "../Uploads"),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp3|m4a|wav|mpeg/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Audio files only!"));
  },
});

const uploadAudioController = async (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).send({
      success: false,
      message: "No file uploaded.",
    });
  }

  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const audioFilePath = req.file.path;
    user.audioFiles.push(audioFilePath);
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Audio uploaded successfully",
      audioFilePath,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error uploading audio.",
      error: error.message || error,
    });
  }
};

// Delete Recording
const deleteRecordingController = async (req, res) => {
  const { filename } = req.params;

  try {
    const userId = req.user._id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { audioFiles: filename } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const filePath = path.join(__dirname, "../Uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file from file system:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to delete audio file from file system.",
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "File deleted successfully." });
    });
  } catch (error) {
    console.error("Error deleting audio:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete audio." });
  }
};

// Comments
const commentsController = async (req, res) => {
  const { name, email, comment } = req.body;

  try {
    const newComment = new Comment({ name, email, comment });
    await newComment.save();
    res.status(201).json({ message: "Comment submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving comment", error });
  }
};

module.exports = {
  registerController,
  loginController,
  updateController,
  forgetpasswordController,
  resetPasswordController,
  uploadAudioController,
  commentsController,
  deleteRecordingController,
};
