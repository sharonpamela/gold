const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cookieSession = require("cookie-session");
const passport =  require("passport");
const keys = require("./config/keys");

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
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/gold", function(error){
    if(error) console.log(error);
    console.log("MONGO connection successful");
  });

// Add routes, both API and view
require('./services/authRoutes')(app);
app.use('/', routes);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});