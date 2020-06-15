const passport = require('passport');
const local_strategy = require('passport-local').Strategy;
const User = require('../models/user');

// Using local passport strategy
passport.use(new local_strategy(function (username, mobile, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }

        if (!user) {
            return done(null, false, { message: 'User doesn\'t exist' });
        } else {
            let is_same_mobile = user.mobile === mobile ? true : false;
            if (!is_same_mobile) {
                return done(null, false, { message: 'Mobile number doesn\'t match' })
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