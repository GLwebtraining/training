var express = require('express');
var multer = require('multer');
var Jimp = require("jimp");
var fs = require('fs');
var bodyParser  = require('body-parser');

var morgan = require('morgan');
var mongoose  = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./user'); // get our mongoose model

var app = express();
var uploadsDir = __dirname + '/public/uploads';
var thumbsDir = __dirname + '/public/uploads/t';
var publicDir = __dirname + '/public';

mongoose.connect(config.db); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, uploadsDir);
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '.jpg');
	}
});

var uploader = multer({ storage : storage }).array('uploadControl');

app.use(express.static(publicDir));

app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara', 
		password: 'password',
		admin: true 
	});

	// save the sample user
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
		res.end();
	});
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});
				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}   
		}
	});
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	}
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
		res.end();
	});
});   

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
	
app.get('/images', function(req,res){
	fs.readdir(uploadsDir, function(err, files){
		Jimp.read(uploadsDir + '/1.jpg', function(err, img){
			Jimp.read(uploadsDir + '/watermark.png', function(err, watermark){
				img.resize(200, Jimp.AUTO).composite(watermark, 0, 0).write(uploadsDir + '/4.jpg');
			});
		});
		res.json(files);
		res.end();		
		// imageProcessing(files, function(){});
	});
})

app.post('/upload',function(req,res){
	uploader(req,res,function(err) {
		// console.log(req.body);
		// console.log(req.files);
		// console.log(err);
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end('{"Message": "File is uploaded!"}');
	});
});

function imageProcessing(files, callback){
	files.forEach(function(file){
		var path = uploadsDir + '/' + file;
		Jimp.read(path, function(err, img){
			img.write(path);
		})
	});
	callback();
}

app.listen(3000, function(){
	console.log('Server started on 3000 port');
});