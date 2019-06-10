var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'justpay',
  password: 'justpay',
  database: 'justpay'
});
var express = require('express');
var router = express.Router();

/* GET result of users by eventId. */
router.get('/', function(req, res, next) {
  var eventId = req.query.eventId;
  connection.query("SELECT eventname from events where id=?;", [eventId], function(error, results, fields) {
    console.log(results);
    if (results.length == 0)
      res.end("<h1>Not Valid Event!!!!</h1>");
    else
      var eventname = results[0].eventname;
    connection.query("SELECT i.id, i.itemname, i.price, i.quantity o_quantity, c.quantity, c.userId, u.nickname FROM bills b join items i on b.id=i.billId join checkLists c on i.id=c.itemId join users u on c.userId=u.id WHERE eventId=?;", [eventId], function(error, results, fields) {
      if (results.length == 0)
        res.end("<h1>Event Not On Result Phase!!!!</h1>");
      var result = results;
      var byUser = [];
      var commons = {};
      var diff = 0;

      result.forEach(function(e, i) {
        if (!this[e.userId]) {
          this[e.userId] = {
            userId: e.userId,
            nickname: e.nickname,
            items: [{
              itemId: e.id, itemname: e.itemname, price: e.price, o_quantity: e.o_quantity, quantity: e.quantity
            }]
          };
          byUser.push(this[e.userId])
        } else {
          this[e.userId]['items'].push({itemId: e.id, itemname: e.itemname, price: e.price, o_quantity: e.o_quantity, quantity: e.quantity});
        }
        if (e.o_quantity == 0) {
          if (!commons[e.id])
            commons[e.id] = {count: 1, price: e.price};
          else {
            commons[e.id]['count']++;
          }
        }
      }, {});

      for (x in commons) {
        diff += commons[x]['price'] % commons[x]['count'];
      }

      res.render("result", {byUser: byUser, commons: commons, diff: diff, eventname: eventname});
    });
  });
});

module.exports = router;
