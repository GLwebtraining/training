
/*

	NOTE:

	1. It is for running mongo base from npm scritp - "start mongod -dbpath d:\\git\\training\\mongo_database"
	2. Be sure that you have the latest version of typescript and tsc
	2.1. For removing old ver of tsc go to c:\program files x86\windows sdk\typescript
	2.2. Go to Evironment variables and check the PATH where existing reference to typescript
	2.3. For install latest version run "npm install -g typescript@latest"
*/

var fs = require('fs');
var exec = require('child_process').spawn;
var mongoose = require('mongoose');
var db = mongoose.connection;
var args = process.argv.slice(- process.argv.length + 2);
var fuelSchema = mongoose.Schema({
	company: 'string',
	address: 'string',
	colon: 'number',
	kran: 'number',
	reservuar: 'number',
	liters: 'number',
	priceForLiter: 'number',
	fuel: 'string',
	code: 'string',
	discountPrice: 'number',
	summaryPrice: 'number',
	pdvPrice: 'number',
	dateTime: 'date'
});
var fuel = mongoose.model('Fuel', fuelSchema);
var pipe = exec('C:\\Program Files\\MongoDB\\Server\\3.2\\bin\\mongod.exe', ['--dbpath=d:\\git\\training\\mongo_database']);

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
	res.file('index.html');
	res.end();
});

app.listen(3305, 'local', function(){
	console.log('Server started on port 3305');
})

pipe.stdout.on('data', function (data) {
    connectToDb();
});

pipe.on('close', function(code) {
    console.log('Process exited with code: '+ code);
});

function connectToDb(){
	mongoose.connect('mongodb://localhost:27017/fuel');

	db.on('error', function(e){
		console.log('Connection error:', e);
	});

	db.once('open', function(){
		console.log('Connected to DB');
	});
}
