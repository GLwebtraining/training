window.onload = initTest;

function test(){

	var sandbox = d3.select('#sandbox');
	var map = sandbox.select('#track-holder-test');
	var svg = map.append('svg');
	var track = svg.append('path');
	var train = svg.append('rect');	
	var control = {                
		auto: sandbox.select('a.auto'),
		changePath: sandbox.select('a.path'),
		speed: {
			current: 0,
			inc: 1,
			isAuto: false,
			isPath1: true
		},
		$: {
			x: 0,
			y: 0,
			angle: 0,
			p0: null,
			p1: null,
			prevPoint: null,
			distance: 0
		}
	};
	
	var trackConfig = [
		[200, 10],
		[350, 10],
		[370, 20],
		[390, 50],
		[395, 100],
		[390, 150],
		[370, 180],
		[350, 190],
		[200, 190],
		[50, 190],
		[30, 180],
		[10, 150],
		[5, 100],
		[10, 50],
		[30, 20],
		[50, 10],
		[200, 10]
	];

	utils.applyAttrs(svg, {
	   width: 400,
	   height: 200 //,viewBox: '0 0 500 500'
	});

	utils.applyAttrs(track.data([trackConfig]), {
		fill: 'none',
		stroke: '#000',
		d: d3.svg.line().tension(0).interpolate("basis")
	});
	
	utils.applyAttrs(train, {
		width: 30,
		height: 10,
		fill: '#000',
		stroke: 'blue',
		transform: 'translate(' + (trackConfig[0][0] - 15) + ',' + (trackConfig[0][1] - 5)  + ')'
	});
	
	train
		.transition()
		.ease('linear')
		.duration(10000)
		.attrTween('transform', translateAlong);
		
	var l = track.node().getTotalLength();
	function translateAlong(d,i,a){
		console.log(d,i,a);
		
		var path = track.node();
		
		l = l - control.$.prevPoint;
		
		
		
		return function(currentDistance){
		
			control.$.p0 = path.getPointAtLength(control.$.prevPoint * l);
			control.$.p1 = path.getPointAtLength(currentDistance * l);

			control.$.angle = Math.atan2(control.$.p1.y - control.$.p0.y, control.$.p1.x - control.$.p0.x) * 180 / Math.PI;
			control.$.prevPoint = currentDistance;
			
			//Shifting center to center of train
			control.$.x = control.$.p1.x - 15,
			control.$.y = control.$.p1.y - 5;
			
			
			return "translate(" + control.$.x + "," + control.$.y + ")rotate(" + control.$.angle + " 15" + " 5" +")";
		};
	}
	
	control.auto.on('click', function(e){
		control.speed.isAuto = !control.speed.isAuto;
		console.log(train.attr('transform'));
		if(control.speed.isAuto){
			train.transition().duration(0);
			var a = train.attr('transform');
			
			console.log(a);
		} else {
			train
				.transition()
				.ease('linear')
				.duration(10000)
				.attrTween('transform', translateAlong);
		}
		
		
		
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
		return false;
	});
	
}


function initTest(){

	var sandbox = d3.select('#sandbox');
	var map = sandbox.select('#track-holder-test');
	var svg = map.append('svg');
	var track = svg.append('path');
	var shadowTrack = svg.append('path');
	var train = svg.append('rect');	
	var control = {                
		auto: sandbox.select('a.auto'),
		changePath: sandbox.select('a.path'),
		speed: {
			current: 0,
			inc: 1,
			isAuto: false,
			isPath1: true
		},
		$: {
			x: 0,
			y: 0,
			angle: 0,
			p0: null,
			p1: null,
			prevPoint: null,
			distance: 0
		}
	};
	
	var trackConfig = [
		[200, 10],
		[350, 10],
		[370, 20],
		[390, 50],
		[395, 100],
		[390, 150],
		[370, 180],
		[350, 190],
		[200, 190],
		[50, 190],
		[30, 180],
		[10, 150],
		[5, 100],
		[10, 50],
		[30, 20],
		[50, 10],
		[200, 10]
	];
	var shadowTrackConfig = [
		[200, 10],
		[350, 10],
		[370, 20],
		[390, 50],
		[395, 100],
		[390, 150],
		[370, 180],
		[350, 190],
		[200, 190],
		[50, 190],
		[30, 180],
		[10, 150],
		[5, 100],
		[10, 50],
		[30, 20],
		[50, 10],
		[150, 10],
		[300, 100]
	];

	var pause = false, stop = false, _distance = 0;

	utils.applyAttrs(svg, {
	   width: 400,
	   height: 200 //,viewBox: '0 0 500 500'
	});

	utils.applyAttrs(track.data([trackConfig]), {
		fill: 'none',
		stroke: '#000',
		d: d3.svg.line().tension(0).interpolate("basis")
	});
	
	utils.applyAttrs(shadowTrack.data([shadowTrackConfig]), {
		fill: 'none',
		stroke: '#000',
		d: d3.svg.line().tension(0).interpolate("basis")
	});

	utils.applyAttrs(train, {
		width: 30,
		height: 10,
		fill: '#000',
		stroke: 'blue',
		transform: 'translate(' + (trackConfig[0][0] - 15) + ',' + (trackConfig[0][1] - 5)  + ')'
	});
	
	control.changePath.on('click', function(e){
		control.speed.isPath1 = !control.speed.isPath1;
		
		control.changePath.text(control.speed.isPath1 ? 'Path #1' : 'Path #2');
			train.transition('train').duration(0);
			pause = true;
			stop = false;
			animPath2();
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
		return false;
	});
	
	control.auto.on('click', function(e){
		control.speed.isAuto = !control.speed.isAuto;
		
		control.auto.text(control.speed.isAuto ? 'Stop' : 'Start');
		
		if(!control.speed.isAuto){
			train.transition('train').duration(0);
			pause = true;
			stop = true;
		} else {
			stop = false;
			animPath1();
		}
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
		return false;
	});
	

	function animPath1(){
		train
			.transition('train')
			.ease('linear')
			.duration(10000)
			.attrTween('transform', translateAlong(track.node()))
			.each('end', animPath1);
	}	
	function animPath2(){
		train
			.transition('train')
			.ease('linear')
			.duration(10000)
			.attrTween('transform', translateAlong(shadowTrack.node()));
	}
			
	function translateAlong(path) {
		var l = path.getTotalLength();
		return function(i) {
			return function(currentDistance) {
				if(!stop){
					_distance = currentDistance;

					if(pause){
						currentDistance = control.$.distance + _distance;
					} else {
						currentDistance = _distance;
						control.$.distance = _distance;
					}

					if(currentDistance > 1){
						control.$.distance = 0;
						control.$.prevPoint = 0;
						animPath2();
					}
					
					control.$.p0 = path.getPointAtLength(control.$.prevPoint * l);
					control.$.p1 = path.getPointAtLength(currentDistance * l);
					control.$.angle = Math.atan2(control.$.p1.y - control.$.p0.y, control.$.p1.x - control.$.p0.x) * 180 / Math.PI;
					control.$.prevPoint = currentDistance;
					
					//Shifting center to center of train
					control.$.x = control.$.p1.x - 15,
					control.$.y = control.$.p1.y - 5;
					
					
				} else {
					if(control.$.distance !== _distance){
						control.$.distance += _distance;
					}
				}
				return "translate(" + control.$.x + "," + control.$.y + ")rotate(" + control.$.angle + " 15" + " 5" +")";
			}
		}
	}
}

function initialize(){
	
	initTest();
	return;
	var sandbox = d3.select('#sandbox');
	var control = {                
		auto: sandbox.select('a.auto'),
		speed: {
			current: 0,
			inc: 1,
			isAuto: false
		},
		$: {
			x: 0,
			y: 0,
			angle: 0,
			p0: null,
			p1: null,
			prevPoint: null,
			distance: 0
		}
	};
	var map = sandbox.select('#track-holder');
	var svg = map.append('svg');
	var track = svg.append('path');
	var train = svg.append('rect');

	var trackConfig = [
		[100, 10],
		[300, 190],
		[300, 10],
		[100, 190]
	];

	var pause = false, stop = false, _distance = 0;

	utils.applyAttrs(svg, {
	   width: 400,
	   height: 200
	});

	utils.applyAttrs(track.data([trackConfig]), {
		fill: 'none',
		stroke: '#000',
		d: d3.svg.line().tension(0).interpolate("cardinal-closed")
	});

	utils.applyAttrs(train, {
		width: 30,
		height: 10,
		fill: '#000',
		stroke: 'blue',
		transform: 'translate(' + (trackConfig[0][0] - 15) + ',' + (trackConfig[0][1] - 5)  + ')'
	});
	
	control.auto.on('click', function(e){
		control.speed.isAuto = !control.speed.isAuto;
		
		control.auto.text(control.speed.isAuto ? 'Stop' : 'Start');
		
		if(!control.speed.isAuto){
			train.transition('train').duration(0);
			pause = true;
			stop = true;
		} else {
			stop = false;
			drive();
		}
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
		return false;
	});

	function drive(){
		train
			.transition('train')
			.ease('linear')
			.duration(control.speed.isAuto ? 10000 : ((10000 / (control.speed.current))))
			.attrTween('transform', translateAlong(track.node()))
			.each('end', drive);
	}
	
	function translateAlong(path) {
		var l = path.getTotalLength();
		return function(i) {
			return function(currentDistance) {
				if(!stop){
					_distance = currentDistance;

					if(pause){
						currentDistance = control.$.distance + _distance;
					} else {
						currentDistance = _distance;
						control.$.distance = _distance;
					}

					if(currentDistance > 1){
						control.$.distance = 0;
						control.$.prevPoint = 0;
						drive();
					}
					
					control.$.p0 = path.getPointAtLength(control.$.prevPoint * l);
					control.$.p1 = path.getPointAtLength(currentDistance * l);
					control.$.angle = Math.atan2(control.$.p1.y - control.$.p0.y, control.$.p1.x - control.$.p0.x) * 180 / Math.PI;
					control.$.prevPoint = currentDistance;
					
					//Shifting center to center of train
					control.$.x = control.$.p1.x - 15,
					control.$.y = control.$.p1.y - 5;
					
					
				} else {
					if(control.$.distance !== _distance){
						control.$.distance += _distance;
					}
				}
				return "translate(" + control.$.x + "," + control.$.y + ")rotate(" + control.$.angle + " 15" + " 5" +")";
			}
		}
	}

}

var utils = {
	applyAttrs: function(node, obj){
		if(!!node && typeof obj === 'object'){
			for(var key in obj){
				node.attr(key, obj[key]);
			}
		}
	}
}