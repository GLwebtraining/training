(function () {
	
	'use strict';

	angular
		.module('auth', [])
		.controller('authController', authController);
		
	authController.$inject = ['$rootScope', '$scope', 'authService', 'user'];
	
	function authController($rootScope, $scope, authService, user){
		var global = $rootScope;
		var vm = this;
		vm.process = process;
		vm.credentials = {
			username: '',
			password: ''
		};

		function process(){
			authService.login(vm.credentials, function(data){
				user.token = data.token;
				global.isAuthorized = true;
			});
		}
	}

})();