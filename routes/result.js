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
  connection.query("SELECT i.id, i.itemname, i.price, i.quantity o_quantity, c.quantity, c.userId, u.nickname FROM bills b join items i on b.id=i.billId join checkLists c on i.id=c.itemId join users u on c.userId=u.id WHERE eventId=?;", [eventId], function(error, results, fields) {
    res.json(results);
  });
});

module.exports = router;
