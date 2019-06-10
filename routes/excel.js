var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();

/* GET excel file. */
router.get('/', function(req, res, next) {
  var ws = XLSX.utils.aoa_to_sheet([1, 2, 3, 4, 5]);
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
	XLSX.writeFile(wb, 'aa.xlsx');
  res.send('respond with a resource');
});

module.exports = router;
