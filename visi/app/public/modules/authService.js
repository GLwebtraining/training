(function () {
	
	'use strict';

	angular
		.module('auth')
		.factory('authService', authService);
		
	authService.$inject = ['$resource'];
	
	function authService($resource){
		
		return $resource('/:api/:action', {}, { 
			login: { method: 'post', params: { api: 'api', action: 'authenticate'}, withCredentials: true },
			setup: { method: 'post', params: { api: 'setup' }, withCredentials: true }
		});

	}

})();