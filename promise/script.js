window.onload = initialize;

function initialize() {
    test().then(function () {
        console.log('After 3 sec - run from Promise');
    });
    test1().then(function () {
        console.log('After 2 sec - run from Promise');
    });
    test2().then(function () {
        console.log('After 1 sec - run from Promise');
    });
}

function test() {
    var deferred = R.defer();
    console.log('Start');
    setTimeout(function () {
        deferred.resolve();
        console.log('Go to promise');
    }, 3000);

    return deferred.promise;
}
function test1() {
    var deferred = R.defer();
    console.log('Start');
    setTimeout(function () {
        deferred.resolve();
        console.log('Go to promise');
    }, 2000);

    return deferred.promise;
}
function test2() {
    var deferred = R.defer();
    console.log('Start');
    setTimeout(function () {
        deferred.resolve();
        console.log('Go to promise');
    }, 1000);

    return deferred.promise;
}

(function(){

	'use strict';

	var R = function(){};

	R.defer = function(){
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

    window.R = R;

})();
