window.onload = init;

function init(){
	var openLink = document.getElementById('open-link');
	initMap();
	
	openLink.onclick = function(e){
		
		
		

	}
	
}

function initMap() {
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay;

	var mapOptions = {
		zoom: 7,
		disableDefaultUI: true,
		scrollwheel: false,
		draggable: false,
		keyboardShortcuts: false,
		disableDoubleClickZoom: true
	};

	directionsDisplay = new google.maps.DirectionsRenderer();

	if (document.getElementById('map')) {
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		directionsDisplay.setMap(map);
	}

	var start = 'New-York';
	var end = 'Washington';
	var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.IMPERIAL
	};
	var mileage = null;
	
	if (!!start && !!end) {
		directionsService.route(request, function (response, status) {
			var distance = '0';
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);

				// The distance fields contain values which are always expressed in meters.
				// 1 meter is 0.000621371 mile
				var mile = 0.000621371;
				distance = (response.routes[0].legs[0].distance.value * 1) * mile;

				if (mileage === null) {
					mileage = distance.toFixed(2);
					document.getElementById('mileage').innerHTML = mileage + ' Miles'
				}

			} else {
				mileage = (0).toFixed(2);
			}
		});
	} else {
		mileage = (0).toFixed(2);
	}
}