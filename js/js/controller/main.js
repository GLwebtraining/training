(function(){
	'use strict';

	angular
		.module('controller.main', [])
		.controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['$scope', '$http'];
	
	function mainCtrl($scope, $http){
		var vm = this;             
		
		$http.get('base/base.json')
			.success(function(response){
				vm.base = response;
			})
			.error(function(error){
				console.log(error);
			});
			
		$http.get('base/function.json')
			.success(function(response){
				vm.functions = response;
			})
			.error(function(error){
				console.log(error);
			});
        
		$http.get('base/web.json')
			.success(function(response){
				vm.web = response;
			})
			.error(function(error){
				console.log(error);
			});

		$http.get('base/jquery.json')
			.success(function(response){
				vm.jquery = response;
			})
			.error(function(error){
				console.log(error);
			});	
		
		$http.get('base/proto.json')
			.success(function(response){
				vm.proto = response;
			})
			.error(function(error){
				console.log(error);
			});	
			
		$http.get('base/patterns.json')
			.success(function(response){
				vm.patterns = response;
			})
			.error(function(error){
				console.log(error);
			});

		$http.get('base/nodejs.json')
			.success(function(response){
				vm.nodejs = response;
			})
			.error(function(error){
				console.log(error);
			});	
		
		$http.get('base/responsiveness.json')
			.success(function(response){
				vm.responsiveness = response;
			})
			.error(function(error){
				console.log(error);
			});	
		
	}

})();