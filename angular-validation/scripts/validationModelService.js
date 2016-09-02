(function(){
	'use strict';

	angular
		.module('angular-validation.validation')
		.service('model', validationModel);

	validationModel.$inject = ['api'];

	function validationModel(api){
		function Model(name){
			this.state = null;
			this.enabled = false;
			this.form = {};
			this.name = name;
		}

		Model.prototype = Object.create(api);
		
		return Model;
	}

})();