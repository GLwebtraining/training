(function () {
	
	'use strict';

	angular
		.module('360view')
		.factory('imageService', imageService);
		
	imageService.$inject = ['$resource'];
	
	function imageService($resource){
		
		return $resource('/images', {}, {get: {method: 'get', isArray: true}});
		
	}

})();