var express	=	require("express");
var multer	=	require('multer');
var app	=	express();

var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '.jpg');
	}
});

var upload = multer({ storage : storage }).array('userPhoto');

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
upload(req,res,function(err) {
console.log(req.body);
console.log(req.files);
if(err) {
return res.end("Error uploading file.");
}
res.end("File is uploaded");
});
});

app.listen(3001,function(){
console.log("Working on port 3000");
});
