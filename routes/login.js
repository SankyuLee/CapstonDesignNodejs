var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'justpay',
  password: 'justpay',
  database: 'justpay'
});
var express = require('express');
var router = express.Router();

/* GET Login Result. */
router.get('/', function(req, res, next) {
  var username = req.query.username;
  var password = req.query.password;
  connection.query("SELECT * from users where username=? and password=?", [username, password], function(error, results, fields) {
    var result;
    if (error || results.length == 0) {
      result = {loginSuccess: false};
    } else {
      result = {loginSuccess: true, user: result[0]};
      req.session.user = result[0];
    }
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
