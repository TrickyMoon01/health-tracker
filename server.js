const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const authController = require('./controllers/auth.js');
const trackerController = require('./controllers/tracker.js');
const usersController = require('./controllers/users.js');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

const app = express();
app.use(express.static(__dirname+'/css'))
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, 
}));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
});

app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/tracker', trackerController);


app.listen(port, () => {
});