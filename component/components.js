function template(html) {
	return function (obj) {
		var key, text = '';
		if(isArray(obj)){
			obj.forEach(function(item){
				text += html.replace(/\|([a-z]+)*\|/gim, function(match, key){
					return item[key];
				});
			});
			return text;
		} else if(isObject(obj)){
			return html.replace(/\|([a-z]+)*\|/gim, function(match, key){
				return obj[key];
			});
		}
	};
}

function defer(){
	return new Promise;	
}

function Promise() {
	this.promise = {
		callbacks: [],
		then: function () {
			this.callbacks = Array.prototype.slice.call(arguments);
		}
	};
}

Promise.prototype = {
	resolve: function() {
		if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[0] === 'function') {
			this.promise.callbacks[0]();
		}
	},
	reject: function() {
		if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[1] === 'function') {
			this.promise.callbacks[1]();
		}
	}
}

function isArray(obj){
	return typeof obj === 'object' && obj instanceof Array;
}
function isObject(obj){
	return typeof obj === 'object' && obj instanceof Object;
}

var mySingleton = (function () {
	var instance;

	function init() {
		return {};
	};
	return {
		getInstance: function () {
			if ( !instance ) {
				instance = init();
			}
			return instance;
		}
	};
})();

var ABC = {
	Component: (function () {
		var instance;

		function init(obj) {
			return new Component(obj);
		};

		return function (obj) {
			if ( !instance ) {
				instance = init(obj);
			}
			return instance.update();
		};
	})();
};

// var ABC = {
// 	Component: function(obj){
// 		return new Component(obj);
// 	}
// };

function Component(settings){
	var required = ['element', 'model', 'events', 'template', 'render', 'update'];
	var hop = settings.hasOwnProperty;
	var keys = Object.keys(settings);

	if(!hop.apply(settings, required)){
		return;
	}

	this.element = settings.element;
	this.model = settings.model;
	this.events = settings.events;
	this.template = settings.template;
	this.render = settings.render;
	
	for(var key in settings){
		if(!~required.indexOf(key)){
			this[key] = settings[key];
		}
	}
}

function curry(fn){ 
	var slice = Array.prototype.slice, 
		storedArgs = slice.call(arguments, 1); 

	return function() { 
		var args = storedArgs.concat(slice.call(arguments)); 
		return fn.apply(this, args); 
	} 
}

function node(id) {
	return document.getElementById(id);
}

function closest(el, selector) {
    while (el) {
        if (el.tagName.toLowerCase() === selector) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}

function delegate(root, element, event, handler) {
	root['on' + event] = function(e){
		var node = closest(e.target, element);
		if(node){
			handler(e, node, node.dataset);
		}
	}
}

window.onload = function(){
	var a = ABC.Component({
		element: node('user-roles'),
		model: [{id:0,item:1},{id:1,item:2},{id:2,item:3},{id:3,item:4}],
		template: '<li data-id="|id|"><span>|item|</span></li>',
		events: {
			'click': 'test'
		},
		render: function () {
			var html = template(this.template)(this.model);
			this.element.innerHTML = html;
			delegate(this.element, 'li', 'click', this.test);
		},
		test: function(event, element, dataset){
			console.log(event, element, dataset);
		}
	}); 

	console.log(a.render());
};


