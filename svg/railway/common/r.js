(function(w){
	'use strict';
	
	function R(element){
		if(!element){
			return;
		}
		return new R.init(element);
	}
	
	R.init = function(element){
		this.element = element;
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
		returnValue: function(){
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
	
	// R.has = function(key){
		// return this.element.hasOwnProperty(key);
	// }.bind(R);
	
	// R.get = function(){
		// return this.element;
	// }.bind(R);
	
	w.R = R;
	
})(window);