var http = require('http');
var fs = require('fs');

var indexPage = fs.readFile('index.html');


var server = http.createServer(function(req, res){


if(req.url === "/index"){
   fs.readFile("index.html", function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
   });
}
else{
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
   res.end();
}

	req.on('close', function(){
	
		console.log('Connection is lost!');
		server.close();
	
	});
	
}).listen(3000);

server.on('listening', function(){

	console.log('Server started in ' + server.address().address + ' on port ' + server.address().port);


});

server.on('close', function(){

	console.log('Server has been closed!');
	process.exit();

});


