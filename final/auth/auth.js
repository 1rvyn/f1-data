// auth.js - Authentication Process
const User = require("../model/user");
// bcryptjs
const bcrypt = require("bcryptjs");
// JSON Web Token (JWT)
const jwt = require("jsonwebtoken");
// JWT Secret
const jwtSecret =
  "5de1db6ef4c40edf802cea47a267fa3bdced49ecb6c2d95abe9617bd3ffe4f9d16d62e";
// Register User
exports.register = async (req, res, next) => {
  // Store username and password passed from request body.
  const { username, password } = req.body;
  // If password is less than 6 characters in length then return 400.
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  // Get current date and time (DD/MM/YYYY) for date of registration
  const currentDateTime = new Date().toLocaleDateString();
  // Utalise bcryptjs to hash the stored password then create user as per the user schema.
  // Then - use JWT to sign the token, apply relevent constraints and store it as a cookie for the user.
  // Catch - any errors and return 400.
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
      dateOfRegistration: currentDateTime,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3 hours in seconds
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3 hours in milliseconds
        });
        res.cookie("username", username, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3 hours in milliseconds
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};
// Login User
exports.login = async (req, res, next) => {
  // Store username and password passed from request body.
  const { username, password } = req.body;
  // Check if the username or password is provided.
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }
  // Try - find the user with the username provided. If user does not exist then reutrn 400.
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // Compare provided password with hashed password then sign the token with JWT, save as cookie once done then grant access/return 201.
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3 hours in seconds
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3 hours in milliseconds
          });
          res.cookie("username", username, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3 hours in milliseconds
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
            role: user.role,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
// Get all users
exports.getUsers = async (req, res, next) => {
  // Find all users from DB and output their username and role.
  // Else return 401, not found.
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        container.role = user.role;
        container.dateOfRegistration = user.dateOfRegistration;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};
// Get data of user
exports.getUserData = async (req, res, next) => {
  // Store username and password passed from request body.
  const { username } = req.body;
  console.log("auth.js/getUserData:", username);
  // Find all users from DB and output their username and role.
  // Else return 401, not found.
  await User.findOne({ username })
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        container.role = user.role;
        container.dateOfRegistration = user.dateOfRegistration;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};
