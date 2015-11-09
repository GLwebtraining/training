window.onload = initialize;

function initialize(){

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