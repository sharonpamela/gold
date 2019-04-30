const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const path = require("path");

const PORT = process.env.PORT || 3001;

require('./models/users');
require('./services/passport');

const app = express();

// Define middleware here
require("./services/passport");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());

// Connect to the Mongo DB
if (process.env.NODE_ENV === "production") {
  mongoose.connect(keys.mongoURI, function (error) {
    if (error) console.log(error);
    console.log("MONGO connection successful");
  });
} else {
  mongoose.connect("mongodb://localhost/gold")
  // mongoose.connect('mongodb+srv://sharon:database123@goldprod-erpit.mongodb.net/test?retryWrites=true');
  // mongoose.connect('mongodb://heroku_7zmcq9tr:sn82m09b8k7ps4fcen13smuq1b@ds149616.mlab.com:49616/heroku_7zmcq9tr');
}

// Add routes, both API and view
require('./services/authRoutes')(app);
app.use('/', routes);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  // app.use(express.static("client/build"));
  app.use(express.static(path.join(__dirname, '../client/build/index.html')));
} else {
  app.use(express.static(path.join(__dirname, '../client/public/index.html')));
}

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});