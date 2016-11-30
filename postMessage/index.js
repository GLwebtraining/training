var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('cert/privkey.pem'),
  cert: fs.readFileSync('cert/cacert.pem')
}

https.createServer(options, function(req, res){
	fs.readFile('test.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
}).listen(8070);