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
  var email = req.query.email;
  var password = req.query.password;
  connection.query("SELECT * from users where email=? and password=?", [email, password], function(error, results, fields) {
    var result;
    if (error || results.length == 0) {
      result = {loginSuccess: false};
    } else {
      result = {loginSuccess: true, user: results[0]};
      req.session.user = results[0];
    }
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
