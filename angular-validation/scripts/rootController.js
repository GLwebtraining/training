(function(){
	'use strict';

	angular
		.module('angular-validation.content')
		.controller('rootController', rootController);

	rootController.$inject = ['$scope', 'enums', 'validation'];

	function rootController($scope, enums, validation){
		var vm = this;
		var response = {
			one: false,
			two: false
		};

		$scope.enums = enums;
		$scope.validation = validation;
		
		$scope.validation.registerModel(enums.Models.tabOne);
		$scope.validation.registerModel(enums.Models.tabTwo);

		for(var key in response){
			if(response.hasOwnProperty(key)){
				if(!response[key]){
					$scope.validation.getModel(key).setState('invalid');
				}
			}
		}
		$scope.validation.enable();

		vm.data = 'Root';
		vm.tabs = {
			active: null,
			isActive: function(index){
				return this.active === index;
			},
			setActive: function(index){
				this.active = index;
			}
		};
	}

})();