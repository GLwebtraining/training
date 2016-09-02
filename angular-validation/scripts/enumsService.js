(function(){
	'use strict';

	angular
		.module('angular-validation.enums', [])
		.factory('enums', enums);

	function enums(){
		var states = {
			'valid': 0,
			'invalid': 1,
			'pending': null
		};
		var tabs = {
			'tabOne': 0,
			'tabTwo': 1
		};
		var names = ['Personal', 'Extra'];
		var models = {
			'tabOne': 'one',
			'tabTwo': 'two'
		};
		var api = {
			States: states,
			Tabs: tabs,
			Names: names,
			Models: models
		};
		return api;
	}

})();