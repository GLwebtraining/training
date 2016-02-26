var express 	= require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose	= require('mongoose');
var cookieParser = require('cookie-parser')

var jwt 		= require('jsonwebtoken');
var config 		= require('./config');
var User 		= require('./user');

var app 		= express();

var apiRoutes = express.Router(); 

var publicDir = __dirname + '/public';
var appFolder = express.static(publicDir + '/app');
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
app.use('/login', loginFolder);

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
				console.log('Redirect to main app');
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

app.use(apiRoutes);

app.listen(3000, function () {
	console.log('Server start on 3000');
});