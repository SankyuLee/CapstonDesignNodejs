var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'justpay',
  password: 'justpay',
  database: 'justpay'
});
var express = require('express');
var router = express.Router();

/* GET SQL result. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  connection.query(req.query.query, function(error, results, fields) {
    var result;
    if (error) {
      result = {isError: true};
      result.result = error;
    } else {
      result = {isError: false};
      result.result = results;
    }
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
