const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

var Users = require('./../modal/User.js');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false,{msg:'Invalid email and password'});
       
      }else{
        return done(null, user);
      }
     
    }).catch(done);
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});