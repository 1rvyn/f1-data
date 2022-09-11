// Routes
const express = require("express");
const router = express.Router();
const { register, login, getUsers, getUserData } = require("./auth");
// Register
router.route("/register").post(register);
// Login
router.route("/login").post(login);
// Get Users
router.route("/getUsers").get(getUsers);
// Get User Data
router.route("/getUserData").post(getUserData);
// Export Router
module.exports = router;
