var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser  = require('body-parser');
var path = require('path');
var privateKey  = fs.readFileSync('cert/test.pem', 'utf8');
var certificate = fs.readFileSync('cert/test.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/header', express.static('D:/ABC/Dev/GlobalHeader/header.js'));
app.use('/newheader', express.static('./newheader/header.js'));
app.use('/public', express.static(path.join(__dirname,'./public')));

// app.get('/header.js', function(req, res) {
//     res.sendFile('D:/ABC/Dev/GlobalHeader/header.js');
//     res.end();
// });

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000);