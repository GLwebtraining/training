var express = require('express');
var multer = require('multer');

var app = express();

var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '.jpg');
	}
});

var uploader = multer({ storage : storage }).array('uploadControl');

app.use(express.static(__dirname + '/public'));

app.post('/upload',function(req,res){
	uploader(req,res,function(err) {
		console.log(req.body);
		console.log(req.files);
		console.log(err);
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});

app.listen(3000, function(){
	console.log('Server started on 3000 port');
});