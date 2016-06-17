var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

var candidates = JSON.parse(fs.read('result.json'));
var currentActive = fs.read('currentActive');
var size = candidates.length;
var active = Number(currentActive) || 0;
var mainHtml = '';

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadFinished = function(status) {
  console.log('Status: ' + status + ', Page Url: ' + page.url);
  if(status === 'success' && page.url === 'https://glo.globallogic.com/'){
  	// page.reload();
  	getProfile();
  }
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

function getProfile(){
	setTimeout(function(){
	console.log('Active = ' + active + ', Requestes page: ' + candidates[active].url);
	page.open(candidates[active].url, function(status){
		console.log('Requestes page status: ' + status);
		if(status === 'success'){
			
				var html = page.evaluate(function(){
					return ('<div>--------------------</div>' + jQuery('#profile-layer').html() + '<div>----------</div>' + jQuery('#profileInfo').html());
				});
				fs.write('result.html', html, 'a+');
				fs.write('currentActive', active, 'w');

				active++;
				if(active <= size){
					getProfile();
				} else {
					phantom.exit();
				}
			
		} else {
			page.reload();
		}
	});
			}, 10000);
}

page.open("https://glo.globallogic.com/apps/glo/login", function(status) {
    if (status === "success") {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
            page.evaluate(function() {
            	$("#login").val('vadym.riznyk');
            	$("#password").val('Cxzasd123');
            	$('#glo-login-form').submit();
                
            });
            // phantom.exit(0);
        });
    } else {
      phantom.exit(1);
    }
});