var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'justpay',
  password: 'justpay',
  database: 'justpay'
});
var express = require('express');
var router = express.Router();

/* caculate total amount of users. */
router.get('/', function(req, res, next) {
  var eventId = req.query.eventId;
  //var user_len = results.length;
  connection.query("SELECT i.id, i.itemname, i.price, i.quantity o_quantity, c.quantity, c.userId, u.nickname FROM events e, items i, checkLists c, bills b, users u WHERE c.itemId=i.id and i.billId=b.id and b.eventId=? and c.userId=u.id;", [eventId], function(error, results, fields) {
    res.json(results);
  });
});

module.exports = router;
