(function(){

	'use strict';

	window.R = window.R || {};

	window.R.ajax = function(settings){
	
		var xhr = new XMLHttpRequest(); 
		
		xhr.open(settings.method, settings.url, true); 
		if(settings.header){
			xhr.setRequestHeader(settings.header.name, settings.header.value);
		}
		xhr.onreadystatechange = function() { 
			if (this.readyState != 4) return; 
			if (this.status != 200) { 
				// handle error
				if(!!settings.error && typeof settings.error === 'function'){
					settings.error({status: this.status, statusText: this.statusText, headers: xhr.getAllResponseHeaders()});
				}
				return; 
			} 
			// available result from this.responseText or this.responseXML 
			if(!!settings.success && typeof settings.success === 'function'){
				settings.success(this.responseText, xhr.getAllResponseHeaders());
			}
		} 
		xhr.send('');
	
	};

	window.R.ready = function(callback){
		window.document.addEventListener('DOMContentLoaded', function(event){
			if(!!callback && typeof callback === 'function'){
				callback(event);
			}
		});
	};

	window.R.defer = function(){
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
				this.promise.callbacks[0].apply(this, arguments);
			}
		},
		reject: function() {
			if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[1] === 'function') {
				this.promise.callbacks[1].apply(this, arguments);
			}
		}
	}

})(window);
