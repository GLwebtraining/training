(function(){
	'use strict';

	angular
		.module('angular-validation.content')
		.controller('tabOneController', tabOneController);

	tabOneController.$inject = ['$scope', 'enums', 'content'];

	function tabOneController($scope, enums, content){
		var vm = this;
		vm.data = 'Tab "One"';
		vm.content = content;
		vm.model = $scope.validation.getModel(enums.Models.tabOne);
	}

})();