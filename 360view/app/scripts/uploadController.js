(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('uploadController', uploadController);
		
	uploadController.$inject = ['$scope', 'FileUploader', 'uploadService'];
	
	function uploadController($scope, FileUploader, uploadService){
		var local = $scope;
		var vm = this;
		
		local.fileSelected = function(files) {
			console.log(files);
		};
		
		local.uploader = new FileUploader({
			autoUpload: true,
			removeAfterUpload: false,
			url: 'http://localhost:3000/upload',
			method: 'POST'
		});
		// uploadService.getUploaderInstance({
			// onErrorItem: function (){
				// console.log('Error', arguments);
			// },
			// onCompleteAll: function(){
				// console.log('Done');
			// }
		// });
	}

})();