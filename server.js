const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

require('./models/users');
require('./services/passport');

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/gold", function(error){
    if(error) console.log(error);
    console.log("MONGO connection successful");
  });

const app = express();
require("./services/passport")
require('./routes/authRoutes')(app);

// Add routes, both API and view
app.use(routes);

const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}



// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


