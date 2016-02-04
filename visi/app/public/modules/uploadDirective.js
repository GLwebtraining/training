(function () {
	
	'use strict';

	angular
		.module('360view')
		.directive('ajaxSubmit', ajaxSubmitDirective);
		
	function ajaxSubmitDirective(){
		var directive = {
			restrict: 'A',
			scope: {
				submitSuccess: '&',
				submitError: '&'
			},
			link: linkFunc
		};
		
		return directive;
		
		function linkFunc(scope, element){
			element.on('submit', function(){
				element.ajaxSubmit({
					success: function(response){
						if(angular.isFunction(scope.submitSucess)){
							scope.submitSucess(response);
						}
					},
					error: function(error){
						if(angular.isFunction(scope.submitError)){
							scope.submitError(error);
						}
					}
				});
				return false;
			});
		}
	}

})();