// auth.js - Authentication Process
// JSON Web Token (JWT)
const jwt = require("jsonwebtoken");
// JWT Secret
const jwtSecret =
  "5de1db6ef4c40edf802cea47a267fa3bdced49ecb6c2d95abe9617bd3ffe4f9d16d62e";
// User Authentication Check
exports.userAuth = (req, res, next) => {
  // Get JWT
  const token = req.cookies.jwt;
  // If the token exists then verfiy it.
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      // If there is an err/no token then deny access (401).
      if (err) {
        return res.status(401).json({ message: "Unauthorised" });
        // If token is valid and role within db is 'reigstered' then allow access.
      } else {
        if (decodedToken.role !== "Registered") {
          return res.status(401).json({ message: "Unauthorised" });
        } else {
          next();
        }
      }
    });
    // If token does not exist then deny access (401).
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorised, token not available" });
  }
};
// Admin Authentication Check
exports.adminAuth = (req, res, next) => {
  // Get JWT
  const token = req.cookies.jwt;
  // If the token exists then verfiy it.
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      // If there is an err/no token then deny access (401).
      if (err) {
        return res.status(401).json({ message: "Unauthorised", });
        // If token is valid and 'role' within db is 'admin' then allow access.
      } else {
        if (decodedToken.role !== "Admin") {
          return res.status(401).json({ message: "Unauthorised" });
        } else {
          next();
        }
      }
    });
    // If token does not exist then deny access (401).
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorised, token not available" });
  }
};
// Update User
exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // Get JWT
  if (role && id) {
    // If the token exists then verfiy it.
    if (role === "Admin") {
      // If there is an err/no token then deny access (401).
      await User.findById(id)
        .then((user) => {
          // If token is valid and 'role' within db is 'Admin' then allow access.
          if (user.role !== "Admin") {
            user.role = role;
            user.save((err) => {
              // Database Error Handler
              if (err) {
                res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
                process.exit(1);
              }
              res.status("201").json({ message: "Update successful", user });
            });
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    }
  }
};
// Delete User
exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.remove())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
};
