var express 	= require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose	= require('mongoose');
var cookieParser = require('cookie-parser');

var multer = require('multer');
var Jimp = require("jimp");
var fs = require('fs');


var jwt 		= require('jsonwebtoken');
var config 		= require('./config');
var User 		= require('./user');
var Project 	= require('./project');

var app 		= express();

var apiRoutes 	= express.Router(); 

var publicDir 	= __dirname + '/public';
var appFolder 	= express.static(publicDir + '/app');
var loginFolder = express.static(publicDir + '/login');
var isAuthorized = false;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.db);
app.set('superSecret', config.secret);
app.use(cookieParser(config.secret));

app.use(morgan('dev'));

app.use('/api', function(req, res, next){
	console.log('isAuthorized', isAuthorized);
	next();
});
// app.use('/api', appFolder);
app.use('/login', loginFolder);

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, uploadsDir);
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '.jpg');
	}
});

var uploader = multer({ storage : storage }).array('uploadControl');

apiRoutes.use(function(req, res, next) {
	console.log('Verify token...');
	var token = req.cookies.user_token || req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		console.log('Got token!');
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
			if (err) {
				console.log('Failed to authenticate token');
				isAuthorized = false;
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				isAuthorized = true;
				console.log('Redirect to main app', decoded);
				app.use('/api', appFolder);
				req.decoded = decoded;
				next();
			}
		});
	} else { 
		isAuthorized = false;
		console.log('Empty token');
		app.use('/api', loginFolder);
		if(req.url !== '/authenticate'){
			res.redirect('/login');
		} else {
			next();
		}
	}
});

apiRoutes.get('/', function(req, res, next){
	res.redirect('/api');
});

apiRoutes.post('/upload',function(req,res){
	uploader(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end('{"Message": "File is uploaded!"}');
	});
});

apiRoutes.get('/images', function(req,res){
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

apiRoutes.post('/setup', function(req, res) {
	var user = new User({ 
		name: req.body.name, 
		password: req.body.password,
		admin: true 
	});

	user.save(function(err) {
		if (err) throw err;
		console.log('User saved successfully');
		res.json({ success: true });
		res.end();
	});
});

apiRoutes.post('/authenticate', function(req, res) {
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			console.log('Authentication failed. User not found');
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400000 // expires in 24 hours
				});
				res.cookie('user_token', token, {maxAge: 86400000});
				res.redirect('/api');
			}   
		}
	});
});

apiRoutes.post('/project/create', function(req, res){
	Project.findOne({
		name: req.body.name
	}, function(err, project){
		if(err) throw err;
		if(!project){
			var project = new Project({ 
				name: req.body.project, 
				owner: req.decoded._doc.name
			});

			project.save(function(err) {
				if (err) throw err;
				console.log('Project created successfully');
				res.json({ success: true });
				res.end();
			});
		} else {
			res.json({ success: false, message: 'Project already exists.' });
			res.end();
		}
	});
});

app.use(apiRoutes);

app.listen(3000, function () {
	console.log('Server start on 3000');
});