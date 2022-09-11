// Express
const express = require("express");
const app = express();
// Express JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Body Parser
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// SocketIO + Server
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// File System
const fs = require("fs");
const spawn = require("child_process").spawn;
// Server Port
const port = process.env.PORT || 8080;
// Colors (console colours)
const colors = require("colors");
// Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// MongoDB
const mongoose = require("mongoose");
const localDB = "mongodb://127.0.0.1:27017/f1";
// Connect to MongoDB Server Function
const connectDB = async () => {
  mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000, // timeout after 1 second
  });
};
module.exports = connectDB;
// Start Server (connect to db then start server)
connectDB();
// ------------------------
// We cannot use this as i need to use server.listen for the socket connection
// const server = app.listen(port, () =>
//   console.log(colors.green("[F1|INFO] Server Started on port " + port))
// );
// -------------------
// Node Process Error Handler
process.on("unhandledRejection", (err) => {
  console.log(colors.red("[F1|ERROR] " + err.message));
  server.close(() => process.exit(1));
});
// Use static files with public folder
app.use(express.static("public"));
// Set the view engine to EJS
app.set("view engine", "ejs");
// Set EJS views path
app.set("views", "./public/views");
// Import auth/route
app.use("/api/auth", require("./auth/route"));
//=====================
// Routes
//=====================
// Root / Home Page
app.get("/", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/home", {
    token: token,
    username: username,
  });
});
// News Page
app.get("/news", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/news", {
    token: token,
    username: username,
  });
});
// Races Page
app.get("/races", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/races", {
    token: token,
    username: username,
  });
});
// Drivers Page
app.get("/drivers", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/drivers", {
    token: token,
    username: username,
  });
});
// Teams Page
app.get("/teams", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/teams", {
    token: token,
    username: username,
  });
});
// Telemetry page
app.get("/telemetry-speed", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/telemetry-speed", {
    qs: req.query,
    token: token,
    username: username,
  });
});
app.get("/telemetry-gear", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/telemetry-gear", {
    qs: req.query,
    token: token,
    username: username,
  });
});
// SocketIO Connection
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
// Post request for above page
app.post("/getGraph", urlencodedParser, function (req, res) {
  if (parseInt(req.body.driverData.raceNumber) <= 9) {
    var raceNum = "0" + req.body.driverData.raceNumber;
  } else {
    raceNum = req.body.driverData.raceNumber;
  }
  // Create the string we feed to the python script with the user data
  var userString =
    req.body.driverData.yearNumber +
    String(raceNum) +
    "Q" +
    req.body.driverData.driverName;

  // Call method to start the graph creation
  onFormResponse(userString);
});

app.post("/getGraphg", urlencodedParser, function (req, res) {
  console.log("sub optimal last minute additional gear shifts telemetry");
  console.log(req.body);

  if (parseInt(req.body.driverData.raceNumber) <= 9) {
    var raceNum = "0" + req.body.driverData.raceNumber;
  } else {
    raceNum = req.body.driverData.raceNumber;
  }
  // Create the string we feed to the python script with the user data
  var userString =
    req.body.driverData.yearNumber +
    String(raceNum) +
    "Q" +
    req.body.driverData.driverName;

  // Call method to start the graph creation
  onFormResponseg(userString);
});
//=====================
// Protected Routes
//=====================
const { adminAuth, userAuth } = require("./middleware/auth.js");
// Admin Page
app.get("/admin", adminAuth, (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/admin", {
    token: token,
    username: username,
  });
});
// Users Page
app.get("/users", userAuth, (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/users", {
    token: token,
    username: username,
  });
});
//=====================
// Account Section
//=====================
// Login Page
app.get("/login", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/login", {
    token: token,
    username: username,
  });
});
// Register Page
app.get("/register", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/register", {
    token: token,
    username: username,
  });
});
// Logout
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.cookie("username", "", { maxAge: "1" });
  res.redirect("/");
});
// Profile Page
app.get("/profile", (req, res) => {
  // Get JWT
  const token = req.cookies.jwt;
  // Get Username
  const username = req.cookies.username;
  res.render("pages/profile", {
    token: token,
    username: username,
  });
});
//=====================
// Error Pages
//=====================
// 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).render("error/404");
});
// 401 (Unauthorised)
app.use((req, res, next) => {
  res.status(401).render("error/401");
});
//=====================
// Telemetry
//=====================
function onFormResponse(userString) {
  // Check to see if the string exists as a file on the server before
  // If it does -> send the image to the websocket
  var path = userString + ".png";
  // this will check if the file exists
  fs.access(path, fs.F_OK, (err) => {
    if (!err) {
      // Just send the image as it exists - no two graphs will be named the same
      console.log("THE FILE EXISTS JUST SEND IT");
      sendImage(userString);
    } else if (err) {
      // If it doesnt already exist lets make it
      const pythonProcess = spawn("python3", ["./python/speed.py", userString]);
      pythonProcess.stdout.on("data", (data) => {
        // Do something with the data returned from python script
        console.log("we got some data back: " + data);
        // Lets call the function to send the image through the websocket :)
        checkImageExists(userString); // Checks if it exists and if it does then it will send the image
      });
    }
  });
}
// if you want you can remove these i just wanted to give you guys the choice between
// the gear shift graph or the speed graph
// its late in the US as i make this commit so probably wont be awake for the final submit
function onFormResponseg(userString) {
  // Check to see if the string exists as a file on the server before
  // If it does -> send the image to the websocket
  var path = userString + "g.png";
  // this will check if the file exists
  fs.access(path, fs.F_OK, (err) => {
    if (!err) {
      // Just send the image as it exists - no two graphs will be named the same
      console.log("THE FILE EXISTS JUST SEND IT");
      sendImage(userString);
    } else if (err) {
      // If it doesnt already exist lets make it
      const pythonProcess = spawn("python3", [
        "./python/gear_s.py",
        userString,
      ]);
      pythonProcess.stdout.on("data", (data) => {
        // Do something with the data returned from python script
        console.log("we got some data back: " + data);
        // Lets call the function to send the image through the websocket :)
        checkImageExistsg(userString); // Checks if it exists and if it does then it will send the image
      });
    }
  });
}
function checkImageExists(userString) {
  var path = userString + ".png";
  // console.log("the path created is :" + path);
  // Check if the file exists
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      // Call function to notify the user there was an error
      sendError();
      return;
    }
    // If the above code determines that the file exists we then allow it to be displayed
    // console.log("there is no error, the file exists!");
    sendImage(userString);
  });
}
function checkImageExistsg(userString) {
  var path = userString + "g.png";
  // console.log("the path created is :" + path);
  // Check if the file exists
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      // Call function to notify the user there was an error
      sendError();
      return;
    }
    // If the above code determines that the file exists we then allow it to be displayed
    // console.log("there is no error, the file exists!");
    sendImageg(userString);
  });
}
function sendError(err) {
  io.emit("recieveError", err);
}
function sendImageg(userString) {
  console.log("user string in the sending function is :" + userString);
  fs.readFile(userString + "g.png", function (err, userString) {
    io.emit("imageToClient", { image: true, buffer: userString });
  });
}
function sendImage(userString) {
  console.log("user string in the sending function is :" + userString);
  fs.readFile(userString + ".png", function (err, userString) {
    io.emit("imageToClient", { image: true, buffer: userString });
  });
}

server.listen(port, () => {
  console.log(colors.green("[F1|INFO] Server Started on port " + port));
});
