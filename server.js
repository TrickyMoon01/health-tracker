const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

const app = express();
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
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/view-pantry', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to your pantry ${req.session.user.username}`);
  } else {
    res.send('Sorry, you must be signed in');
  }
});

app.use('/explore', usersController);

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});