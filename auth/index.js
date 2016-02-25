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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.db);
app.set('superSecret', config.secret);
app.use(cookieParser(config.secret));


app.use(morgan('dev'));

app.use('/api', function(req, res, next){
	next();
});
app.use('/login', loginFolder);

apiRoutes.use(function(req, res, next) {
	console.log('verify token');
	// check header or url parameters or post parameters for token
	var token = req.cookies.user_token || req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		console.log('Got token');
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
			if (err) {
				console.log('Failed to authenticate token');
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				app.use('/api', appFolder);
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else { 
		console.log('Empty token');
		app.use('/api', loginFolder);
		if(req.url !== '/authenticate'){	
			res.redirect('/login');
			// return res.status(200).send({ 
			// 	success: false, 
			// 	message: 'No token provided.' 
			// });
		} else {
			next();
		}
		// 
	}
});
	

apiRoutes.post('/setup', function(req, res) {
	// // create a sample user
	var user = new User({ 
		name: req.body.name, 
		password: req.body.password,
		admin: true 
	});

	// // save the sample user
	user.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
		res.end();
	});
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			console.log('Authentication failed. User not found');
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			console.log(user);
			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400000 // expires in 24 hours
				});
				res.cookie('user_token', token, {maxAge: 86400000});
				// return the information including token as JSON
				// res.json({
				// 	success: true,
				// 	message: 'Enjoy your token!',
				// 	token: token
				// });
				res.redirect('/api');
			}   
		}
	});
});

app.use(apiRoutes);

app.listen(3000, function () {
	console.log('Server start on 3000');
});