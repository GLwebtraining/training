(function(){
	'use strict';

	angular
		.module('angular-validation.validation', [])
		.factory('validation', validation);

	validation.$inject = ['enums', 'api', 'model'];

	function validation(enums, api, model){
		var api = Object.create(api);

		Object.assign(api, {
			name: 'Global Validation',
			state: null,
			models: [],
			_enable: api.enable,
			_isValid: api.isValid,
			_isInvalid: api.isInvalid,
			enable: function(){
				var models = this.models;
				if(!!models.length){
					for(var i = 0; i < models.length; i++){
						models[i].enable();
					}
					this._enable();
				} else {
					this.disable();
				}
			},
			registerModel: function(name){
				this.models.push(new model(name));
			},
			getModel: function(name){
				return this.models.filter(function(model){
					return model.name === name;
				})[0];
			},
			isValid: function(){
				return this.models.every(function(model){
					return model.isValid();
				});
			},
			isInvalid: function(){
				return this.models.some(function(model){
					return model.isInvalid();
				});
			},
			isPending: function(){
				return this.state === enums.states['pending'];	
			}
		});
		return api;
	}

})();