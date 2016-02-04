(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('uploadController', uploadController);
		
	uploadController.$inject = ['$scope'];
	
	function uploadController($scope){
		var local = $scope;
		var vm = this;
		
		vm.uploadSuccess = uploadSuccess;
		vm.uploadError = uploadError;
		
		function uploadSuccess(response){
			console.log(response);
		}
		function uploadError(error){
			console.log(error);
		}
	}
})();