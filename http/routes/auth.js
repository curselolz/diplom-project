const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticate = require("../../middlewares/authenticate");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");
router.get('/', function (req, res) {
  res.render("index", {});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
  }),
  function(req, res) {
    var user = req.user;
    // res.location("dashboard");
    res.render("admin", { user: user });
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect("/");
  }
}

module.exports = router;