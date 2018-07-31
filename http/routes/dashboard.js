const express = require('express');
const router = express.Router();
const account = require("../../models/account");
router.get("/", (req, res) => {

	res.render("admin",{});
});

router.post("/data", (req, res) => {
  const id = req.body.id;
  const type = req.body.type;
  const category = req.body.category;
  const date = req.body.date;
  const note = req.body.note;
  const currency = req.body.currency;
  const amount = req.body.amount;

  const data = new account({
    id: id,
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

router.post("/select", (req, res) => {
  const userId = req.body.id;
  const items = account.selectData(userId,result => {
    res.send(result);
  });
});

router.post("/changeEmail", (req, res) => {
  const userID = req.body.id;
  const emailToChange = { "email": req.body.email };
  const query = { "_id": userID };
  User.changeEmail(query, emailToChange, function (result) {
    res.send(result);
  });
});

router.post("/changePass", (req, res) => {


});
module.exports = router;