const passport = require("../middlewares/auth");

module.exports = function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
  } , function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
      req.user = user;
      return next();
  })(req, res, next);
};
