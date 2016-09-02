(function(){
	'use strict';

	angular
		.module('angular-validation.validation')
		.factory('api', api);

	api.$inject = ['enums'];

	function api(enums){
		function checkForm(){
			var model = !!this.getModel && !!this.getModel(this.name) ? this.getModel(this.name) : this;
			var form = model.form;

			if(!!form && !!Object.keys(form).length){
				// console.log(form);
				// this.setState(form.$dirty ? (form.$valid ? 'valid' : 'invalid') : 'valid' );
				this.setState(form.$valid ? 'valid' : 'invalid');
			}
		}
		return {
			isValid: function(){
				checkForm.call(this);
				return this.isEnabled() && this.state === enums.States['valid'];
			},
			isInvalid: function(){
				checkForm.call(this);
				return this.isEnabled() && this.state === enums.States['invalid'];
			},
			isEnabled: function(){
				return this.enabled;
			},
			getState: function(){
				return this.state;
			},
			setState: function(state){
				if(enums.States.hasOwnProperty(state)){
					this.state = enums.States[state];
				} else {
					console.info('The state "' + state + '" is invalid. Set to "Invalid".');
					this.state = enums.States['invalid'];
				}
			},
			reset: function(){
				this.state = null;
			},
			enable: function(){
				console.info('Model "' + this.name + '" is enabled.');
				this.enabled = true;
			},
			disable: function(){
				console.info('Model "' + this.name + '" is disabled.');
				this.enabled = false;
			}
		};
	}

})();