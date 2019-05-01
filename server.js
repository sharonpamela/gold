const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Connect to the Mongo DB
if (process.env.NODE_ENV === "production") {
  mongoose.connect(keys.mongoURI, function (error) {
    if (error) console.log(error);
    console.log("MONGO connection successful");
  });
} else {
  mongoose.connect("mongodb://localhost/gold")
}

require('./models/users');
require('./services/passport');


app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  // app.use(express.static("client/build"));
  app.use(express.static(path.join(__dirname, '../client/build/index.html')));
} else {
  app.use(express.static(path.join(__dirname, '../client/public/index.html')));
}


// Add routes, both API and view
app.use(routes);
require("./services/passport")
require('./services/authRoutes')(app);


// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});