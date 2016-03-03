(function () {

  'use strict';

	angular
		.module('Root', ['api'])
		.controller('appController', appController);

	appController.$inject = ['$scope', 'api'];

	function appController($scope, api){
		var local = $scope;
		var vm = this;

		vm.project = {};

		vm.isProjectCreated = isProjectCreated;

		vm.createProject = createProject;

		function isProjectCreated(){
			// console.log(vm.forms.project.$valid);
			return vm.forms.project.$valid;
		}

		function createProject(){
			api.create({ name: vm.project.name }, function(){}, function(){});
		}
	}

})();