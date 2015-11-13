window.onload = initialize;

function initialize(){

	var sandbox = d3.select('#sandbox');
	var map = sandbox.select('#track-holder');
	var svg = map.append('svg');
	var track = svg.append('path');
	var train = svg.append('rect');
	var control = {                
		up: sandbox.select('a.up'),
		down: sandbox.select('a.down'),
		auto: sandbox.select('a.auto'),
		current: sandbox.select('.current-speed'),
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
			t: null,
			distance: 0,
			animation: null
		}
	};
	
	
	var trackConfig = [
		[100, 10],
		[300, 190],
		[300, 10],
		[100, 190]
	];


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
		T: 0,
		transform: 'translate(' + (trackConfig[0][0] - 15) + ',' + (trackConfig[0][1] - 5)  + ')'
	});	
	
	control.auto.on('click', function(e){
		control.speed.isAuto = !control.speed.isAuto;
		
		control.auto.text(control.speed.isAuto ? 'Stop' : 'Start');
		
		if(!control.speed.isAuto){
			train.transition().duration(0);
			
		} else {
			animation();
		}
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
		return false;
	});
	
	control.up.on('click', function(){
		
		if(control.speed.current < 10){
			prev = control.speed.current;
			control.speed.current += control.speed.inc;
		}
		
		control.current.text(control.speed.current);
		if(!!control.speed.isAuto){
			animation();
		}
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
	});
	
	control.down.on('click', function(){
		control.speed.current -= control.speed.inc;
		
		if(control.speed.current > 0){
			if(!!control.speed.isAuto){
				animation();
			}
		} else {
			control.speed.current = 0;
			train.transition().duration(0);
		}
		
		control.current.text(control.speed.current);
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
	});

	
	function animation(){
		var time = !!train.attr('T') ? 10000 - (((100 * train.attr('T'))/track.node().getTotalLength()) * 10000) / 100 : 10000;
		
		train.transition().duration(time / control.speed.current).ease('linear')
			.attrTween('T', attrTweenText())
			.each('end', function(){
				train.attr('T', 0);
				animation();
			});

		function attrTweenText(){
			var newValue = track.node().getTotalLength();
			return function(){
				var currentValue = +train.attr('T');
				var i = d3.interpolateNumber( currentValue, newValue );
				return function(t) {
					
					control.$.p0 = track.node().getPointAtLength(control.$.t);
					control.$.p1 = track.node().getPointAtLength(i(t));
					control.$.angle = Math.atan2(control.$.p1.y - control.$.p0.y, control.$.p1.x - control.$.p0.x) * 180 / Math.PI;//angle for tangent
					control.$.t = i(t);
					
					//Shifting center to center of train
					control.$.x = control.$.p1.x - 15,
					control.$.y = control.$.p1.y - 5;
					
					train.attr('transform', "translate(" + control.$.x + "," + control.$.y + ")rotate(" + control.$.angle + " 15" + " 5" +")");
					// console.log(t);
					train.attr('T', i(t));
					return i(t);
				 }
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