(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('orderController', orderController);
		
	orderController.$inject = ['$scope', '$q', 'imageService'];
	
	function orderController($scope, $q, imageService){
		var local = $scope;
		var vm = this;
		
		local.$on('upload:complete', function(){
			uploadComplete().then(processImages);
		});
		
		function uploadComplete(){
			var fetchCallback = $q.defer();
			imageService.get(function(files){
				fetchCallback.resolve(files);
			}, function(){
				console.log('Something bad happend');
			});
			return fetchCallback.promise;
		}

		function processImages(files){
			vm.images = files.map(function(file){ return { src: '../uploads/' + file } });
		}
		
	}

})();