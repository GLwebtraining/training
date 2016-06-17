var page = require('webpage').create();
var fs = require('fs');

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadFinished = function(status) {
  console.log('Status: ' + status + ', Page Url: ' + page.url);
  // Do other things here...
};

var content = JSON.parse(fs.read('result.json'));
console.log('read data:', content.length);


page.open('index.html', function(status){
	if(status === 'success'){
	        console.log(page.getPage());
	    // page.getPage("content", function(content) {
	    // })
		// page.evaluate(function(){
		// 	console.log(jQuery('#profileInfo').html());

		// });
	}
});
