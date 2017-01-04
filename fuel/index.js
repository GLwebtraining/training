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
