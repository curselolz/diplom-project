var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");
var account = require("../models/account");
// Get Homepage
router.get('/', function(req, res) {
	res.render('index');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}
// Register User
router.post('/register', function (req, res) {
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody("email", "Email is required").notEmpty();
	req.checkBody("email", "Email is not valid").isEmail();
	req.checkBody("username", "Username is required").notEmpty();
	req.checkBody("password", "Password is required").notEmpty();
	req
		.checkBody("password2", "Passwords do not match")
    .equals(req.body.password2);

	var errors = req.validationErrors();

	if (errors) {
		// res.render('register', {
		// 	errors: errors
		// });
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
					// res.render('register', {
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
						console.log(user);
					});
					res.redirect('/');
					req.flash('success_msg', 'You are registered and can now login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		console.log(username);
		console.log(password);
		User.getUserByUsername(username, function (err, user) {
			console.log(user);
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
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
		res.render("/admin", { user: user});
  }
);

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});
router.get("/dashboard",ensureAuthenticated, (req, res) => {
	console.log("get dashboard route");
	res.render("admin");
});

router.post("/dashboard/data", (req, res) => {
	console.log("get request data");
	let id = req.body.id;
	let type = req.body.type;
	let category = req.body.category;
	let date = req.body.date;
	let note = req.body.note;
	let currency = req.body.currency;
	let amount = req.body.amount;

	let data = new account({
		id:id,
		type: type,
		category: category,
		date: date,
		note: note,
		currency: currency,
		amount: amount
	});
	account.insertData(data, function (err, data) {
		res.send(data);
	});
});

router.post("/dashboard/select", (req, res) => {
	var userId = req.body.id;
	var items = account.selectData(userId,function (result) {
		res.send(result);
	});
});

module.exports = router;