const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("express-rate-limit");

//dotenv
dotenv.config();

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

//mongodb connection
connectDB();

// rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Apply rate limiting to forget password route
app.use("/forgetpassword", limiter);

//routes
app.use("/", userRoutes);

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, (error) => {
  if (error) {
    console.log("Server is not running", error);
  }
  console.log("Server is Running on Port", PORT);
});
