(function () {
	
	'use strict';

	angular
		.module('360view')
		.factory('uploadService', uploadService);
		
	uploadService.$inject = ['FileUploader'];
	
	function uploadService(FileUploader){
		var api = {
			getUploaderInstance: getUploaderInstance
		};

		return api;
		
		function getUploaderInstance(options) {
			var uploader = new FileUploader(angular.extend({}, options, {
                autoUpload: true,
                removeAfterUpload: true,
				url: 'http://localhost:3000/upload',
				method: 'POST'
			}));

			return uploader;
		}
	}

})();