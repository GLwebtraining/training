var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/fuel');

var db = mongoose.connection;

db.on('error', function(e){
	console.log('Connection error:', e);
});

db.once('open', function(){
	console.log('Connected');
});
