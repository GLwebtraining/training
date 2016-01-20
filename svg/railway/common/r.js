(function(w){
	'use strict';
	
	function R(element){
		if(!element){
			return;
		}
		return new R.init(element);
	}
	
	R.debugger = false;
	
	R.init = function(element){
		this.element = R.Element(element);
	};
	
	R.init.prototype = {
		attrs: function(obj){
			var element = this.element;
			
			if(R.isExists(element) && R.isObject(obj)){
				var method = R(element).has('attr') && R.isFunction(element.attr) ? 'attr' : 'setAttribute';
				
				for(var key in obj){
					if(R(obj).has(key)){
						element[method](key, obj[key]);
					}
				}
			}
			return this;
		},
		css: function(obj){
			var element = this.element;
			if(R.isExists(element) && R.isObject(obj)){
				for(var key in obj){
					if(R(obj).has(key)){
						element.style[key] = obj[key];
					}
				}
			}
			return this;
		},
		events: function(event, callback){
			var element = this.element;

			if(R.isExists(element)){
				var method = R(element).has('on') && R.isFunction(element.on) ? 'on' : 'addEventListener';

				element[method](event, function(e){
					if(R.isFunction(callback)){
						callback();
					}
					e.stopPropagation();
					e.preventDefault();
				});
			}
			return this;
		},
		has: function(key){
			return this.element.hasOwnProperty(key);
		},
		get: function(){
			return this.element;
		}
	};
	
	R.isArray = function(item){
		if(R.isExists(item)){
			if(item instanceof Array){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	
	R.isObject = function(item){
		if(R.isExists(item)){
			if(!R.isArray(item) && item instanceof Object){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	
	R.isFunction = function(f){
		return typeof f === 'function';
	};
	
	R.isExists = function(item){
		return !!item;
	};

	R.guid = function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
	
	R.Element = function(selector){
		if(!R.isQuerySelector(selector)){
			return selector;
		}
		var delay, count = 0;
		var regEx = {
			byClassName: /\.[A-Za-z0-9]+/,
			byId: /\#[A-Za-z0-9]+/,
			byCreation: /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
		};
		var api = {
			byClassName: getByClassName,
			byId: getById,
			byCreation: getByCreation
		}
		
		function checkSelector(selector){
			for(var key in regEx){
				if(regEx[key].test(selector)){
					return api[key](selector);
				}
			}
		}
		
		function getById(selector){
			return document.getElementById(selector.substr(1)) || null;
		}
		
		function getByClassName(selector){
			var matched = document.querySelectorAll(selector);
			return matched.length > 0 ? matched : null;
		}
		
		function getByCreation(selector){
			var tag = selector.match(/([\w:-]+)/g, '')[0];
			return document.createElement(tag);
		}
		
		return checkSelector(selector);
	}
	
	R.isNodeElement = function(element){
		return !!~[1, 2, 3, 8].indexOf(element.nodeType);
	}
	
	R.isQuerySelector = function(element){
		return !R.isNodeElement(element) && !~['number', 'boolean'].indexOf(typeof element) && !(R.isArray(element) || R.isObject(element) || R.isFunction(element));
	}
	
	R.debugger = function(enable){
		if(!!enable){
			logger();
		} else {
			destroyLogger();
		}
	};
	
	R.log = function(){
		var logger = document.getElementById('R-content');
		if(!!logger){
			var args = Array.prototype.slice.call(arguments);
			var result = args.map(function(arg){
				if(R.isObject(arg)){
					return JSON.stringify(arg);
				}
				if(R.isArray(arg)){
					return arg.join(' ');
				}
				return arg;
			});

			logger.innerHTML += result.join(' ') + '<br />';
		}
	};
	
	function logger(){
		var body = document.body;
		var loggerHolder = document.createElement('div');
		var loggerContent = document.createElement('div');
		loggerHolder.id = 'R-logger';
		loggerContent.id = 'R-content';
		R(loggerHolder).css({
			position: 'fixed',
			bottom: 0,
			right: 0,
			width: '300px',
			height: '300px',
			border: '1px solid #000',
			overflow: 'auto'
		});
		R(loggerContent).css({
			width: '100%',
			overflow: 'hidden'
		});
		loggerHolder.appendChild(loggerContent);
		document.body.appendChild(loggerHolder);
	}
	
	function destroyLogger(){
		var loggerHolder = document.getElementById('R-logger');
		if(!!loggerHolder){
			document.body.removeChild(loggerHolder);
		}
	}
	
	w.R = R;
	
})(window);