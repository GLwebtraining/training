(function(){
	function World(){}
	World.prototype = {
		models: [],
		draw: function(){},
		add: function(model){
			this.models.push(new abstractWorldModel(model));
		},
		config: function(basis){
			this.width = basis.width;
			this.height = basis.height;
		},
		create: function(){
			this.draw();
			this.models.forEach(function(model){
				model.draw();
			});
		}
	};
	function abstractWorldModel(settings){
		this.name = settings.name;
	}
	
	abstractWorldModel.prototype = {
		draw: function(){}
	};
/*
	// create game area
	var railsWorld = new World;
	
	// setup Rails Area
	railsWorld.config({
		width: 200,
		height: 200
	});
	
	// add objects to Rails Area
	railsWorld.add({
		proto: 'rails',
		points: []
	});
	railsWorld.add({
		proto: 'station',
		name: 'Station 1',
		atPercent: 20
	});
	railsWorld.add({
		proto: 'station',
		name: 'Station 2',
		atPercent: 50
	});
	railsWorld.create();
	*/
	
	
	// freight car, coach car, locomotive
	function RailwayCar(settings){
		Object.defineProperties(this, {
			type: {
				value: (!!settings && !!settings.type ? settings.type : 'coach'),
				writable: false,
				configurable: false
			},
			color: {
				value: (!!settings && !!settings.color ? settings.color : 'black'),
				writable: false,
				configurable: false
			}
		});
	}

	RailwayCar.prototype = {};
	
	function Train(settings){
		
	}
	
	Train.prototype = {
		speed: {
			current: 0,
			min: 0,
			max: 10
		},
		direction: {
			forward: false,
			backward: false
		},
		trainSet: Object.create( Array.prototype, {
					min: { value: 1, writable: false, configurable: false, enumerable: false }, 
					max: { value: 3, writable: false, configurable: false, enumerable: false },
					add: {
						get: function(obj){
							return this.push;
						}
					}
		}),
		addRailwayCar: function(settings){
			this.trainSet.add(new RailwayCar(settings))
		},
		removeRailwayCar: function(){},
		start: function(){},
		stop: function(){}
	};

	modules.exports('World', World);
	modules.exports('Model', abstractWorldModel);
	modules.exports('Train', Train);
	modules.exports('RailwayCar', RailwayCar);
})();
