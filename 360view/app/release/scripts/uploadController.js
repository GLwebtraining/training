(function () {
	
	'use strict';

	angular
		.module('360view')
		.controller('uploadController', uploadController);
		
	uploadController.$inject = ['$scope', '$window', 'Upload'];
	
	function uploadController($scope, $window, Upload){
		var local = $scope;
		var vm = this;
		
		vm.processed = processed;
		// vm.upload = new FileUploader({
		// 	autoUpload: false,
		// 	removeAfterUpload: false,
		// 	url: 'http://localhost:3000/upload',
		// 	method: 'POST',
		// 	arrayKey: ''
		// });

		function processed(){
			// vm.upload.uploadAll();

		}

		vm.uploadFiles = function (event) {

			 Upload.upload({
			 	url: '/upload',
			 	arrayKey: '',
			 	data: {file: local.files}
			 });

			 // event.preventDefault();
			 console.log(123);
		};
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