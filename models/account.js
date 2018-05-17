var mongoose = require("mongoose");
delete mongoose.connection.model["User"];
var Schema = mongoose.Schema;
let db = mongoose.connection;
var accountScheme = new Schema({
  id: {
    type:String
  },
  type: {
    type: String,
    index: true
  },
  category: {
    type: String
  },
  date: {
    type: Date
  },
  note: {
    type: String
  },
  currency: {
    type: String
  },
  amount: {
    type: Number
  }
});

var account = (module.exports = mongoose.model("account", accountScheme));

module.exports.insertData = function (newData, callback) {
  db.collection("account").insert(newData);
};

module.exports.selectData = function (userId,callback) {
  db.collection("account")
    .find({id:userId})
    .toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        callback(result);
      }
    });
};
