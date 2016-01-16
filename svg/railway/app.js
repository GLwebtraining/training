window.onload = initialize;

function initialize(){
	
	if(!!R && R.isExists(d3)){
		R.debugger(true);
		start();
		
	} else {
		console.error('d3 is undefined!');
	}
	
}

function start(){

	var Railway = new Platform('Railway');
	var Train = new Platform('Train');
	var TrafficLight = new Item('TrafficLight');
	var Track = new Platform('Track');


	Track.addItem(Train);
	Railway.addItem(TrafficLight);
	Railway.addItem(Track);
	
	Train.addItem(buildRailwayCar());
	Train.addItem(buildRailwayCar());
	Train.addItem(buildRailwayCar());
	
	addTrainActions({
		start: function(){
			R.log('Train is running!');
		},
		stop: function(){
			R.log('Train is stopped!');
		}
	});
	

	Railway.on('train:start', function(){
		if(count === 0){
			console.log('The train is departed!');
		} else {
			console.log('The train in on the way!');
		}
	});

	Railway.on('train:stop', function(){
		if(count === 500){
			console.log('The train is arrived!');	
		} else {
			console.log('Emergency train stop!!! Be patient.');
		}
	
	});


	Train.start();

	TrafficLight.addAction('turnRedLightOn', function(){
		console.log('Red light is ON!!!');
	});

	TrafficLight.addAction('turnGreenLightOn', function(){
		console.log('Green light is ON! Go ahead!');
	});

	Train.on('trafficlight:turnredlighton', function(){
		Train.stop();
	});

	Train.on('trafficlight:turngreenlighton', function(){
		Train.start();
	});

	var count = 0;
	var journey = setInterval(function(){
		count++;
		if(count === 100){
			TrafficLight.turnRedLightOn();
		}
		if(count === 250){
			TrafficLight.turnGreenLightOn();
		}
		if(count === 500){
			clearInterval(journey);
			Train.stop();
		}
	}, 100);

	function buildRailwayCar(){
		return new Item('RailwayCar');
	}
	
	function addTrainActions(events){
		for(var key in events){
			Train.addAction(key, events[key]);
		}
	}
	
}

function Platform(name){
	this.name = name;
	this.id = R.guid();
	this.actions = Event;
	this.items = [];
}

Platform.prototype = {
	addItem: function(item){
		var isItemsExist = this.items.some(function(obj){
			return obj.id === item.id;
		});
		
		if(!isItemsExist){
			this.items.push(item);
		}
	},
	addAction: function(name, action){
		this[name] = function(){
			action();
			this.actions.broadcast(this.name.toLowerCase() + ':' + name.toLowerCase());
		};
	},
	on: function(eventName, callback){
		this.actions.on(eventName, callback);
	}
};

function Item(name){
	this.name = name;
	this.id = R.guid();
	this.actions = Event;
}

function Action(name, settings){
	this.name = name;
	this.steps = settings.steps;
}

Action.prototype = {
	isProgress: false,
	isEnd: false,
	start: function(){
		this.inProgress = true;
		this.inEnd = false;
	},
	end: function(){
		this.inProgress = false;
		this.inEnd = true;
	},
	progress: function(){
		this.inProggress = true;
		this.inEnd = false;
	},
	isInProgress: function(){
		return this.isProgress;
	},
	isInEnd: function(){
		return this.isEnd;
	}
};

Item.prototype = {
	addAction: function(name, action){
		this[name] = function(){
			action();
			this.actions.broadcast(this.name.toLowerCase() + ':' + name.toLowerCase());
		};
	},
	on: function(eventName, callback){
		this.actions.on(eventName, callback);
	}
};

Event = {
	observers: {},
	broadcast: function (eventName){
		for(var key in this.observers){
			if(key === eventName){
				var callbacks = this.observers[key];
				if(callbacks.length > 0){
					for(var i = 0, l = callbacks.length; i < l; i++){
						if(typeof callbacks[i] === 'function'){
							callbacks[i]();
						}
					}
				}
			}
		}
		
	},
	on: function (observer, callback){
		var isEventExist = observer in this.observers;
		if(!isEventExist){
			this.observers[observer] = [];
		}

		this.observers[observer].push(callback);
	}
}

