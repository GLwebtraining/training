window.onload = initialize;

function initialize(){

	var sandbox = 	d3.select('#sandbox');
	var map = 		sandbox.select('#track-holder');
	var svg = 		map.append('svg');
	var track = 	svg.append('path');
	var shadowTrack;
	var train = 	svg.append('rect');
	var control = {                
		up: 		sandbox.select('a.up'),
		down: 		sandbox.select('a.down'),
		auto: 		sandbox.select('a.auto'),
		current: 	sandbox.select('.current-speed'),
		direction:	sandbox.select('a.direction'),
		config: 	sandbox.select('#trackConfig'),
		speed: {
			current: 	0,
			inc: 		1,
			isAuto: 	false
		},
		$: {
			x: 		0,
			y: 		0,
			angle: 	0,
			point1: null,
			point2: null,
			currentTrack: 'endlessSign',
			mainPath: true,
			direction: 'forward'
		}
	};

	utils.applyAttrs(svg, {
	   width: 	400,
	   height: 	200
	});

	utils.applyAttrs(track.data([utils.config.track[control.$.currentTrack].coords]), {
		fill: 	'none',
		stroke: '#000'
	});

	utils.applyAttrs(train, {
		width: 		30,
		height: 	10,
		fill: 		'#000',
		stroke: 	'blue'
	});	
	
	utils.applyEvent('click', control.auto, function(){
		control.speed.isAuto = !control.speed.isAuto;
		control.auto.text(control.speed.isAuto ? 'On' : 'Off');
		animation(!!control.speed.isAuto ? 'start': 'stop');
	});
	
	utils.applyEvent('click', control.direction, function(){
		control.$.direction = control.$.direction === 'forward' ? 'backward' : 'forward';
		control.direction.text(control.$.direction);
	});
	
	utils.applyEvent('click', control.up, function(){
		control.speed.current = control.speed.current >= 10 ? 10 : control.speed.current + control.speed.inc;
		control.current.text(control.speed.current);
		animation(!!control.speed.isAuto ? 'start' : 'do nothing');
	});
	
	utils.applyEvent('click', control.down, function(){
		control.speed.current = control.speed.current <= 0 ? 0 : control.speed.current - control.speed.inc;
		control.current.text(control.speed.current);
		animation(control.speed.current > 0 && !!control.speed.isAuto ? 'start' : 'stop');
	});
	
	utils.applyEvent('change', control.config, function(){
		control.$.prevTrack = control.$.currentTrack;
		control.$.currentTrack = control.config[0][0].value === 'ellipse' ? 'main' : control.config[0][0].value;
		var d0 = d3.svg.line().tension(0).interpolate(utils.config.track[control.$.prevTrack].interpolate)(utils.config.track[control.$.prevTrack].coords);
		var d1 = d3.svg.line().tension(0).interpolate(utils.config.track[control.$.currentTrack].interpolate)(utils.config.track[control.$.currentTrack].coords);
		
		changeTrackAnimation({
			path: track,
			from: d0,
			to: d1,
			beforeAnimateionCallback: function(){
				if(control.$.currentTrack !== 'main'){
					if(!!shadowTrack) {
						shadowTrack.remove();
						mainBranch.remove();
						shadowBranch.remove();
						branching.remove();
					}
				}
				train.attr('opacity', 1).transition().duration(500).attr('opacity', 0);
			},
			afterAnimateionCallback: function(){
				train.transition().duration(500).attr('opacity', 1);
				setTimeout(applyPath, 100);
			}
		});
		
		control.speed.current = 0;
		control.current.text(control.speed.current);
		control.speed.isAuto = false;
		control.auto.text('Off');
		control.$.x = 0;
		control.$.y = 0;
		control.$.angle = 0;
		control.$.point1 = null;
		control.$.point2 = null;
	});
	
	applyPath();
	
	function applyPath(){

		control.$.currentTrack = control.config[0][0].value === 'ellipse' ? 'main' : control.config[0][0].value;
	
		utils.applyAttrs(track.data([utils.config.track[control.$.currentTrack].coords]), {
			d: d3.svg.line().tension(0).interpolate(utils.config.track[control.$.currentTrack].interpolate)
		});
		
		if(control.$.currentTrack === 'main'){
			shadowTrack = !!svg.select('.additional-track')[0][0] ? svg.select('.additional-track') : svg.append('path').classed({'additional-track': true});
			mainBranch = !!svg.select('.main-branch')[0][0] ? svg.select('.main-branch') : svg.append('path').classed({'main-branch': true});
			shadowBranch = !!svg.select('.shadow-branch')[0][0] ? svg.select('.shadow-branch') : svg.append('path').classed({'shadow-branch': true});
			
			branching = !!svg.select('.change-branch')[0][0] ? svg.select('.change-branch') : svg.append('rect').classed({'change-branch': true});
			
			

			utils.applyAttrs(shadowTrack.data([utils.config.track.shadow.coords]), {
				fill: 'none',
				stroke: '#000',
				d: d3.svg.line().tension(0).interpolate("basis"),
				T: 0
			})
			utils.applyAttrs(mainBranch.data([utils.config.branch.main.coords]), {
				fill: 'none',
				stroke: 'red',
				'stroke-width': 2,
				d: d3.svg.line().tension(0).interpolate("basis")
			})
		
			utils.applyAttrs(branching, {
				fill: 'blue',
				opacity: 0.1,
				stroke: 'none',
				x: utils.config.event.branching.x,
				y: utils.config.event.branching.y,
				width: utils.config.event.branching.w,
				height: utils.config.event.branching.h
			});
			
			utils.applyEvent('click', branching, function(){
				control.$.mainPath = !control.$.mainPath;
				branching
					.transition().attr('opacity', 0.3)
					.transition().attr('opacity', 0.1);
				
				var d0 = d3.svg.line().tension(0).interpolate(utils.config.branch[control.$.mainPath ? 'shadow' : 'main'].interpolate)(utils.config.branch[control.$.mainPath ? 'shadow' : 'main'].coords);
				var d1 = d3.svg.line().tension(0).interpolate(utils.config.branch[control.$.mainPath ? 'main' : 'shadow'].interpolate)(utils.config.branch[control.$.mainPath ? 'main' : 'shadow'].coords);
				
				changeTrackAnimation({
					path: mainBranch,
					from: d0,
					to: d1,
					duration: 1000,
					afterAnimateionCallback: function(){
						var branchedTrack = control.$.mainPath ? track : shadowTrack;
						
						control.track = {
							node: branchedTrack.node(),
							size: branchedTrack.node().getTotalLength()
						};
						animation('start');
					}
				});
			});
		}

		utils.applyAttrs(train, {
			transform: 'translate(' + (utils.config.track[control.$.currentTrack].coords[0][0] - 15) + ',' + (utils.config.track[control.$.currentTrack].coords[0][1] - 5)  + ')',
			T: 0
		});
		
		control.track = {
			node: track.node(),
			size: track.node().getTotalLength()
		};
	}
	
	function animation(option){
		option = !!option && typeof option === 'string' ? option.toLowerCase() : 'stop';
		
		if(option === 'start'){
			var time = !!train.attr('T') ? 10000 - (((100 * train.attr('T'))/control.track.size) * 10000) / 100 : 10000;
			
			train.transition().duration(time / control.speed.current).ease('linear')
				.attrTween('T', attrTweenTrack())
				.each('end', function(){
					train.attr('T', 0);
					if(control.$.mainPath){
						animation('start');
					}
				});

			function attrTweenTrack(){
				var newValue = control.track.size;
				return function(){
					var currentValue = +train.attr('T');
					var i = d3.interpolateNumber( currentValue, newValue );
					var prevPoint = null;
					return function(t) {
						
						control.$.point1 = control.track.node.getPointAtLength(prevPoint);
						control.$.point2 = control.track.node.getPointAtLength(i(t));
						control.$.angle = Math.atan2(control.$.point2.y - control.$.point1.y, control.$.point2.x - control.$.point1.x) * 180 / Math.PI;
						prevPoint = i(t);
						
						//Shifting center to center of train
						control.$.x = control.$.point2.x - 15,
						control.$.y = control.$.point2.y - 5;
						
						train.attr('transform', "translate(" + control.$.x + "," + control.$.y + ")rotate(" + control.$.angle + " 15" + " 5" +")");
						train.attr('T', i(t));
						return i(t);
					 }
				}
			}
		}
		else if(option === 'stop'){
			train.transition().duration(0);
		}
	}
	
	function changeTrackAnimation(options){
		
		if(!!options.beforeAnimateionCallback && typeof options.beforeAnimateionCallback === 'function'){
			options.beforeAnimateionCallback();
		}
		
		transition(options.path, options.from, options.to);
		
		function transition(path, d0, d1) {
		  path.transition()
			  .duration(options.duration || 2000)
			  .attrTween("d", pathTween(d1, 10)).each('end', function(){
					if(!!options.afterAnimateionCallback && typeof options.afterAnimateionCallback === 'function'){
						options.afterAnimateionCallback();
					}
			  });
		}
		
		function pathTween(d1, precision) {
		  return function() {
			var path0 = this,
				path1 = path0.cloneNode(),
				n0 = path0.getTotalLength(),
				n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

			// Uniform sampling of distance based on specified precision.
			var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
			while ((i += dt) < 1) distances.push(i);
			distances.push(1);

			// Compute point-interpolators at each distance.
			var points = distances.map(function(t) {
			  var p0 = path0.getPointAtLength(t * n0),
				  p1 = path1.getPointAtLength(t * n1);
			  return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
			});

			return function(t) {
			  return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
			};
		  };
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
	},
	applyEvent: function(event, node, callback){
		node.on(event, function(){
			if(typeof callback === 'function'){
				callback();
			}
			d3.event.stopPropagation();
			d3.event.preventDefault();
		});
	},
	config: {
		track: {
			empty: {
				interpolate: 'cardinal-closed',
				coords: [
					[0, 0],
					[5, 0],
					[5, 5],
					[0, 5]
				]
			},
			main: {
				interpolate: 'basis',
				coords: [
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
				]
			},
			shadow: {
				interpolate: 'basis',
				coords: [
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
				]
			},
			endlessSign: {
				interpolate: 'cardinal-closed',
				coords: [
					[100, 10],
					[300, 190],
					[300, 10],
					[100, 190]
				]
			}
		},
		branch: {
			main: {
				interpolate: 'basis',
				coords: [
					[70, 12],
					[150, 10],
					[170, 10]
				]
			},
			shadow: {
				interpolate: 'basis',
				coords: [
					[70, 12],
					[100, 10],
					[150, 22],
					[170, 30]
				]
			}
		},
		event: {
			branching: {
				x: 95,
				y: -3,
				w: 30,
				h: 30
			}
		}
	}
}