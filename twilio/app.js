var client = require('twilio')('AC623de65447a546ad07e96cb1aa2eb0db', '1d2a8085e7e245683be8895ac7f4b518');

client.sendMessage({
	to: '+380999714236',
	from: '+15097742295',
	body: 'Привет Котан! :)'
}, function(err, responseData){
	
    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    } else {
    	console.log(err);
    }

});
