(function(){

	'use strict';

	angular
		.module('js-lessons', ['ngRoute', 'controller.main'])
		.config(routeCfg)
		.config(httpCfg);


	httpCfg.$inject = ['$httpProvider'];
	routeCfg.$inject = ['$routeProvider'];

	function httpCfg($httpProvider){
		//initialize get if not there
		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}
		//disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	}

	function routeCfg($routeProvider){
		$routeProvider
			.when('/:folder/:file', {
				templateUrl: function(template){
					console.log('templateUrl: ', template )
					return 'view/'+template.folder+'/'+template.file+'.html';
				}
			}).otherwise({
				redirectTo: '/'
			});
	}

})();
