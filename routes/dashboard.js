var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get("/dashboard", (req, res) => {
	console.log("get dashboard route");
	res.render("admin");
});

router.post("/dashboard/data", (req, res) => {
  console.log("get request data");
  let type = req.body.type;
  let category = req.body.category;
  let date = req.body.date;
  let note = req.body.note;
  let currency = req.body.currency;
  let amount = req.body.amount;

  let data = new account({
    type: type,
    category: category,
    date: date,
    note: note,
    currency: currency,
    amount: amount
  });
  console.log(data);
  account.insertData(data, function(err, data) {
    if (err) throw err;
  });
	res.location("/dashboard");
	res.redirect("/dashboard");
});

router.post("/dashboard/select", (req, res) => {
  console.log("get select request");
  let items = account.selectData(function(result) {
    res.send(result);
  });
});

module.exports = router;