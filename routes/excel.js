var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'justpay',
  password: 'justpay',
  database: 'justpay'
});
var filenamify = require('filenamify');
var XLSX = require('xlsx');
var express = require('express');
var router = express.Router();

/* GET excel file. */
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
      var arr = [];
      var row_cnt = 1;
      for (e in byUser) {
        arr.push(["닉네임", byUser[e]['nickname']]);
        row_cnt++;
        arr.push(["항목", "가격", "수량", "합계"]);
        row_cnt++;
        var start_row = row_cnt;
        for (i in byUser[e]['items']) {
          if (byUser[e]['items'][i].o_quantity == 0)
            arr.push([byUser[e]['items'][i].itemname, byUser[e]['items'][i].price, "1/"+commons[byUser[e]['items'][i]['itemId']]['count'], Math.floor(commons[byUser[e]['items'][i]['itemId']]['price']/commons[byUser[e]['items'][i]['itemId']]['count'])]);
          else
            arr.push([byUser[e]['items'][i].itemname, byUser[e]['items'][i].price, byUser[e]['items'][i].quantity, "=B"+row_cnt+"*C"+row_cnt]);
          row_cnt++;
        }
        arr.push(["Total", "", "", "=SUM(D"+start_row+":D"+(row_cnt-1)+")"]);
        row_cnt++;
        arr.push([""]);
        row_cnt++;
      }
      arr.push(["Remainder","","",diff]);
      var ws = XLSX.utils.aoa_to_sheet(arr);
    	var wb = XLSX.utils.book_new();
    	XLSX.utils.book_append_sheet(wb, ws, filenamify(eventname));
    	XLSX.writeFile(wb, 'event'+eventId+'.xlsx');
      res.send('respond with a resource');
    });
  });
});

module.exports = router;
