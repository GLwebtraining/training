var webPage = require('webpage');
var page = webPage.create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;


var isExists = function(obj){
	console.log('Element is', !!obj ? 'exists': 'undefined');
	return !!obj;
};

var loadInProgress = false;
var testindex = 0;
var steps = [
	function(){
		console.log('Loading jQuery');
		page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	},
	function(){
		console.log('Load Mail Google page');
		page.open('http://mail.google.com');

	},
	function(){
		page.evaluate(function(){
			var emailField = document.getElementById('Email'); //jQuery('#Email');
			var nextButton = document.getElementById('next');

		console.log('OOOOO', typeof page);
			if(isExists(emailField) && isExists(nextButton)){
				emailField.value = 'vadym.riznyk';
				nextButton.click();
			}
		});
	},
	function(){
		page.evaluate(function(){
			var passField = document.getElementById('Passwd');
			var signButton = document.getElementById('signIn');
			
			if(isExists(passField) && isExists(signButton)){
				passField.value = '4564321middlefinger';
				signButton.click();
			}
		});
	},
	function(){
		page.evaluate(function(){
			var search = document.getElementById('gbqfq');
			
			isExists(search);
		});
	}
];

interval = setInterval(executeRequestsStepByStep, 1000);


function executeRequestsStepByStep(){
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        //console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onUrlChanged = function(url){
	console.log('Page URL is', url);
};
