const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const db = require('./../models');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await db.Users.findOne({ googleId: profile.id });
        if(existingUser) {
          done(null, existingUser);
        } else {
          const user = await db.Users.create({ googleId: profile.id });
          done(null, user);
        }
      } catch(e) {
          done(e);
      }
  })
);

// this sets an identifying token that says you are without a doubt
// the user that logged in
passport.serializeUser( (user, done) => {
  // this sets the user.id as the cookie
  done(null, user.id);
});

// takes the id that we stuffed in the cookie from serialize and turn it back into a user model
passport.deserializeUser( async (id, done) => {
  const user = await db.User.findById(id);
  done(null, user);
});

// Tells passport to use a google strategy and what credentials
// and function to run when the strategy is used

// The second parameter is the function that fires every time the user gets redirected
// back to our app after they sign in
