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
	
	Train.addItem(buildRailwayCar());
	Train.addItem(buildRailwayCar());
	Train.addItem(buildRailwayCar());
	
	addTrainActions({
		start: function(){
			R.log('Train is running!');
			console.log(Railway);
		},
		stop: function(){
			R.log('Train is stopped!');
		}
	});
	
	Railway.addItem(Train);
	
	console.log(Train);
	
	Railway.on('train:start', function(){
		console.log('The train is departed!');
	});
	
	R.log(Railway.name, 'includes', Railway.items.length, 'item(s):');
	for(var i = 0, l = Railway.items.length; i < l; i++){
		R.log('-', Railway.items[i].name, 'includes', ( Railway.items[i].items.length || 0 ), 'item(s):');
		for(var n = 0, m = Railway.items[i].items.length; n < m; n++){
			R.log('--', Railway.items[i].items[n].name, 'includes', ( Railway.items[i].items[n].length || 0), 'item(s):');
		}
	}
	
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
	this.actions = new Event;
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
}

function Action(eventName, eventAction){
	this.name = eventName;
	
}

function Event(){
    this.observers = [];
}

Event.prototype = {
	broadcast: function (eventName){
		
		this.observers.push({ observer: observer, context: ctx });
		
	/*
		for (var i in this.observers){
			var item = this.observers[i];
			item.observer.call(item.context, data);
		}
	*/
	},
	on: function (observer, callback){
		var ctx = context || null;
		this.observers.push({ observer: observer, context: ctx });
	}
	/*
	,
	off: function (observer){
		for (var i in this.observers){
			if ( this.observers[i].observer == observer){
				delete this.observers[i];
			}
		}
	}
	*/
}

// function Area(){
	
// }

// function Train(){
	
// }

// function RailwayCar(){
	
// }

// function RailwayRoad(){
	
// }

// function trafficLight(){
	
// }

// function switchingTrack(){
	
// }