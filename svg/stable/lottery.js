setTimeout(init, 1000);

function init(){
	var sandbox = 	d3.select('#lottery');
	var svg = 		sandbox.append('svg');
	var lotteryTemplate = d3.select('#lottery-template').select('svg');

		
	var a = lotteryTemplate.select('#g12');
}