window.onload = initialize;

function initialize(){
	
	if(!!R && R.isExists(d3)){
		
		start();
		
	} else {
		console.error('d3 is undefined!');
	}
	
}

function start(){
	
	var Railway = new Platform('Railway');
	
	var Train = new Platform('Train');
	
	var RailwayCar = new Item();
	
	Train.addObject(RailwayCar);
	Train.addObject(RailwayCar);
	Train.addObject(RailwayCar);
	
	Railway.addObject(Train)
	
}

function Platform(name){
	this.name = name;
	this.actions = [];
	this.objects = [];
}

Platform.prototype = {
	addObject: function(item){
		this.objects.push(item);
	},
	addAction: function(action){
		this.actions.push(action);
	}
};

function Item(){
	
}

function Action(){
	
}

function Event(){
    this.observers = [];
}

Event.prototype = {
	broadcast: function (data){
		for (var i in this.observers){
			var item = this.observers[i];
			item.observer.call(item.context, data);
		}
	},
	on: function (observer, context){
		var ctx = context || null;
		this.observers.push({ observer: observer, context: ctx });
	},
	off: function (observer){
		for (var i in this.observers){
			if ( this.observers[i].observer == observer)
				delete this.observers[i];
			}
		}
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