(function(w){
	'use strict';

	var cache = {}, currentFile, q = {};
	var head = w.document.head || null;

	w.require = require;
	w.module = {};

	q.defer = qUtils();

	var load = q.defer();

	Object.defineProperty(w.module, 'export', {
		get: function(){
			var isValueNotExists = cache[currentFile] === undefined;

			return cache[currentFile]; 
		},
		set: function(value){
			cache[currentFile] = value;
		}
	});

	function require(path){
		if(!!path && !cache.hasOwnProperty(path) && !!head){;
			currentFile = path;
			var script = createScript(path);
			head.appendChild(script);
		}
		return script.onload();
	}

	function createScript(path){
		var hasExt = !!~path.indexOf('.js') ? '' : '.js';
		var script = w.document.createElement('script');
		script.type = 'text/javascript';
		script.src = path + hasExt;
		script.onload = function(){
			return w.module.export;
		};
		
		return script;
	}

	function qUtils(){
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

		return function(){
			return new Promise;	
		}		
	}

})(window);