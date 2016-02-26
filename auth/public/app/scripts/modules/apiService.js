(function () {

  'use strict';

	angular
		.module('api', ['ngResource'])
		.factory('api', api);

	api.$inject = ['$resource'];

	function api($resource){
		
	}

})();