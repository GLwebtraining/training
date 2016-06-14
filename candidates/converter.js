var args = process.argv;
var xls = args[2];
var json = args[3];

var ext = xls.split('.')[1];
var isXlsx = /xlsx/.test(ext);
var isXls = /xls/.test(ext);

var node_xj = require('xls-to-json');
var xlsxj = require("xlsx-to-json");
(isXlsx ? xlsxj : node_xj)({
	input: xls,
	output: json
}, function(err, res){
	if(err){
		console.log(err);
	} else {
		console.log(res);
	}
});
