var express = require('express');
var multer = require('multer');
var fs = require('fs');

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

app.get('/images', function(req,res){
	fs.readdir('./uploads', function(err, files){
		console.log(files);
		for(var i = 0; i < files.length; i++){
		var options = {
			root: './uploads'
		};
			res.sendFile(files[i], options);
			// fs.readfile(files[i], function(){
				
			// })
		}
		
	});
	
	res.end('Fetch images')
})

app.post('/upload',function(req,res){
	uploader(req,res,function(err) {
		console.log(req.body);
		console.log(req.files);
		console.log(err);
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end('{"Message": "File is uploaded!"}');
	});
});

app.listen(3000, function(){
	console.log('Server started on 3000 port');
});