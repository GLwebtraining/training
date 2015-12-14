(function(window, document){
	'use strict';
	
	var r = new Object;
	var exports = new Object;
	var api = {
		mainRoute: function(){},
		secondRoute: function(){},
		redLight: function(){},
		greenLight: function(){}
	}
	Object.seal(api);
	
	window.RailwaysInterface = api;
	
	/*

	window.RailwaysInterface provides with the following callbacks:

	1. Switch branch to main route (window.RailwaysInterface.mainRoute)
	2. Switch branch to second route (window.RailwaysInterface.secondRoute)
	3. Turn on the red light (window.RailwaysInterface.redLight)
	4. Turn on the green light (window.RailwaysInterface.greenLight)

	*/
	
	var pathMainConfig = [
		[200, 10],
		[50, 10],
		[30, 20],
		[10, 50],
		[5, 100],
		[10, 150],
		[30, 180],
		[50, 190],
		[200, 190],
		[350, 190],
		[370, 180],
		[390, 150],
		[395, 100],
		[390, 50],
		[370, 20],
		[350, 10],
		[200, 10]
	];
	
	var pathBranchConfig = [
		[200, 10],
		[50, 10],
		[30, 20],
		[10, 50],
		[5, 100],
		[10, 150],
		[30, 180],
		[50, 190],
		[100, 190],
		[120, 190],
		[250, 100]
	];
	
	var pathBranchSwitcherConfig = {
		main: [
			[70, 189],
			[150, 190],
			[170, 190],
			[185, 190]
		],
		branch: [
			[70, 189],
			[100, 190],
			[120, 190],
			[178, 150]
		]
	};
	
	document.addEventListener("DOMContentLoaded", initialize);
	
	function initialize(){
		if(!d3){
			throw new Error('d3js is undefined!');
			return;
		}

		initialSetup();
	}
	
	function initialSetup(){
		r.ailways = d3.select('#railways');
		if(!r.ailways[0][0]){
			throw new Error('Railways holder is undefined!');
			return;
		}
		
		r.currentBranch = 'main';
		
		r.svg = r.ailways.append('svg');
		r.track = r.svg.append('path');
		r.branch = r.svg.append('path');
		r.switcher = r.svg.append('path');
		
		r.svg.style({
			width: 450,
			height: 300
		});
		
		r.track.style({
			fill: 'none',
			stroke: '#000'
		});
		
		r.branch.style({
			fill: 'none',
			stroke: '#000'
		});
		
		r.switcher.style({
			fill: 'none',
			stroke: 'blue',
			'stroke-width': 2
		});
		
		
		
		r.track.attr('d', d3.svg.line().tension(0).interpolate('basis')(pathMainConfig));
		r.branch.attr('d', d3.svg.line().tension(0).interpolate('basis')(pathBranchConfig));
		r.switcher.attr('d', d3.svg.line().tension(0).interpolate('basis')(pathBranchSwitcherConfig[r.currentBranch]));

		buildLights();
		buildBranchSwitcher();
	}
	
	function buildLights(){
		r.lights = r.svg.append('g');
		r.strokeLights = r.lights.append('rect');
		r.redLight = r.lights.append('circle');
		r.greenLight = r.lights.append('circle');
		
		r.lights.attr('transform', 'translate(400, 10) scale(1, 1)');
		
		r.strokeLights.style({
			fill: 'darkslategray',
			width: 30,
			height: 55,
			rx: 10,
			ry: 10
		});
		
		r.redLight.style({
			fill: 'red',
			r: 10,
			cx: 15,
			cy: 15,
			opacity: 0.5,
			stroke: '#000'
		});
		
		r.greenLight.style({
			fill: 'chartreuse',
			r: 10,
			cx: 15,
			cy: 40,
			opacity: 0.5,
			stroke: '#000'
		});
		
		r.redLight.on('mouseenter', function(){
			if(!r.redLight.attr('turn-on')){
				r.redLight.transition().style('opacity', 0.7);
			}
		});
		
		r.redLight.on('mouseleave', function(){
			if(!r.redLight.attr('turn-on')){
				r.redLight.transition().style('opacity', 0.5);
			}
		});
		
		r.redLight.on('click', function(){
			if(!r.redLight.attr('turn-on')){
				r.redLight.transition().style('opacity', 1);
				r.redLight.attr('turn-on', true);
				
				if(typeof api.redLight === 'function'){
					api.redLight();
				}
				
				if(r.greenLight.attr('turn-on')){
					r.greenLight.transition().style('opacity', 0.5);
					r.greenLight.attr('turn-on', null);
				}
			} else {
				r.redLight.transition().style('opacity', 0.5);
				r.redLight.attr('turn-on', null);
			}
		});
		
		r.greenLight.on('mouseenter', function(){
			if(!r.greenLight.attr('turn-on')){
				r.greenLight.transition().style('opacity', 0.7);
			}
		});
		
		r.greenLight.on('mouseleave', function(){
			if(!r.greenLight.attr('turn-on')){
				r.greenLight.transition().style('opacity', 0.5);
			}
		});
		
		r.greenLight.on('click', function(){
			if(!r.greenLight.attr('turn-on')){
				r.greenLight.transition().style('opacity', 1);
				r.greenLight.attr('turn-on', true);
				
				if(typeof api.greenLight === 'function'){
					api.greenLight();
				}
				
				if(r.redLight.attr('turn-on')){
					r.redLight.transition().style('opacity', 0.5);
					r.redLight.attr('turn-on', null);
				}
			} else {
				r.greenLight.transition().style('opacity', 0.5);
				r.greenLight.attr('turn-on', null);
			}
		});		
	}
	
	function buildBranchSwitcher(){
		r.switcherButton = r.svg.append('g');
		r.switcherStroke = r.switcherButton.append('circle');
		r.switcherFill = r.switcherButton.append('circle');
		
		r.switcherButton.attr('transform', 'translate(115, 185)');
		
		r.switcherStroke.style({
			r: 20,
			fill: 'none',
			stroke: 'cornflowerblue',
			opacity: 0.4
		});
		
		r.switcherFill.style({
			r: 20,
			fill: 'cornflowerblue',
			stroke: 'none',
			opacity: 0.4
		});
		
		r.switcherButton.on('mouseenter', function(){
			r.switcherStroke.transition().style('opacity', 1);
			r.switcherFill.transition().style('opacity', 0.6);
		});
		
		r.switcherButton.on('mouseleave', function(){
			r.switcherStroke.transition().style('opacity', 0.4);
			r.switcherFill.transition().style('opacity', 0.4);
		});
		
		r.switcherButton.on('click', function(){
			var prev = r.currentBranch;
			r.currentBranch = r.currentBranch === 'main' ? 'branch' : 'main';
			
			var d0 = d3.svg.line().tension(0).interpolate('basis')(pathBranchSwitcherConfig[prev]);
			var d1 = d3.svg.line().tension(0).interpolate('basis')(pathBranchSwitcherConfig[r.currentBranch]);
			
			changeTrackAnimation({
				path: r.switcher,
				from: d0,
				to: d1,
				duration: 1000,
				afterAnimateionCallback: function(){
					if(r.currentBranch === 'main'){
						if(typeof api.mainRoute === 'function'){
							api.mainRoute();
						}
					} else {
						if(typeof api.secondRoute === 'function'){
							api.secondRoute();
						}
					}
				}
			});
		});
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

})(window, document);