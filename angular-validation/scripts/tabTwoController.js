(function(){
	'use strict';

	angular
		.module('angular-validation.content')
		.controller('tabTwoController', tabTwoController);

	tabTwoController.$inject = ['$scope', 'enums', 'content'];

	function tabTwoController($scope, enums, content){
		var vm = this;
		vm.data = 'Tab "Two"';
		vm.content = content;
		vm.model = $scope.validation.getModel(enums.Models.tabTwo);
	}

})();