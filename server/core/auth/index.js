const passport = require('passport');
const local_strategy = require('passport-local').Strategy;
const User = require('../models/user');

// Using local passport strategy
passport.use(new local_strategy({
    usernameField: 'username',
    passwordField: 'mobile' // Passport Local strategy by default accept username and password field. hence setting mobile as password field
  },function (username, password, done) {

    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }

        if (!user) {
            return done(null, false, { message: 'User does not exist' });
        } else {
            let is_same_mobile = user.mobile === password ? true : false;
            if (!is_same_mobile) {
                return done(null, false, { message: 'Mobile number does not match' })
            }
            return done(null, user);
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;