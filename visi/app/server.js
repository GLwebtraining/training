var express = require('express');
var multer = require('multer');
var Jimp = require("jimp");
var fs = require('fs');

var app = express();
var uploadsDir = __dirname + '/public/uploads';
var thumbsDir = __dirname + '/public/uploads/t';
var publicDir = __dirname + '/public';

var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, uploadsDir);
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '.jpg');
	}
});

var uploader = multer({ storage : storage }).array('uploadControl');

app.use(express.static(publicDir));
	
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