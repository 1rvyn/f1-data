// user.js - User Schema
const mongoose = require("mongoose");
// User Schema for DB
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Registered",
    required: true,
  },
  dateOfRegistration: {
    type: String,
    required: true,
  },
});
// User constant
const User = mongoose.model("user", UserSchema);
// Export User
module.exports = User;
