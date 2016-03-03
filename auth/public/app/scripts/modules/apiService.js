(function () {

  'use strict';

	angular
		.module('api', ['ngResource'])
		.factory('api', api);

	api.$inject = ['$resource'];

	function api($resource){
		return $resource('/api/:entity/:action', { entity: '@entity', action: '@action' }, {
			create: { method: 'post', params: { name: '@name', entity: 'project1', action: 'create' } }
		});	
	}

})();