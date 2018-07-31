const express = require("express");
const User = require("../../models/user");
const router = express.Router();

router.post('/', function (req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

  // Validation
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("confirm", "Passwords do not match").equals(confirm);

  var errors = req.validationErrors();

  if (errors) {
    res.render('404', {
    	errors: errors
    });
    console.log(errors);
  }
  else {
    //checking for email and username are already taken
    User.findOne({
      username: {
        "$regex": "^" + username + "\\b", "$options": "i"
      }
    }, function (err, user) {
      User.findOne({
        email: {
          "$regex": "^" + email + "\\b", "$options": "i"
        }
      }, function (err, mail) {
        if (user || mail) {
          // res.render('admin', {
          // 	user: user,
          // 	mail: mail
          // });
        }
        else {
          var newUser = new User({
            email: email,
            username: username,
            password: password
          });
          User.createUser(newUser, function (err, user) {
            if (err) throw err;
          });
          res.render('index',{user:username});
          req.flash('success_msg', 'You are registered and can now login');
        }
      });
    });
  }
});

module.exports = router;