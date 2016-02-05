(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('orderController', orderController);
		
	orderController.$inject = ['$scope', 'imageService'];
	
	function orderController($scope, imageService){
		var local = $scope;
		var vm = this;
		
		local.$on('upload:complete', uploadComplete);
		
		function uploadComplete(){
			imageService.get(function(files){
				console.log('Done', files);
			}, function(){
				console.log('Something bad happend');
			});
		}
		
	}

})();