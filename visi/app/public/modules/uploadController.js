(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('uploadController', uploadController);
		
	uploadController.$inject = ['$rootScope', '$scope'];
	
	function uploadController($rootScope, $scope){
		var global = $rootScope;
		var local = $scope;
		var vm = this;
		
		vm.uploadSuccess = uploadSuccess;
		vm.uploadError = uploadError;
		
		function uploadSuccess(response){
			global.$broadcast('upload:complete');
		}
		function uploadError(error){
			console.error('Something bad happend');
		}
	}
})();