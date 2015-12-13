window.onload = initialize;
var App = Object.create(null);

function initialize(){

	App.Area = modules.require('World');
	App.Model = modules.require('Model');
	App.Train = modules.require('Train');
	App.RailwayCar = modules.require('RailwayCar');
	
	var RailsArea = new App.Area;
	
	RailsArea.config({
		width: 100,
		height: 100
	});
	
	RailsArea.add({
		name: 'rails',
		points: []
	});
	
	RailsArea.add({
		name: 'station',
		atPercent: 40
	});
	
	RailsArea.create();
	
}