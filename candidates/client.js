(function(window){

	'use strict';

	if(!R){
		throw new Error('Framework is undefined');
		return;
	}

	var rootUrl = 'https://glo.globallogic.com/users/profile/';
	var suffix = '?tab=info_profile';

	R.ready(function(){
		console.log('DOM ready');
		 getInternals();
	});

	function getInternals(){
		var result = [];
		var defer = R.defer();

		R.ajax({
			method: 'get',
			url: 'https://raw.githubusercontent.com/GLwebtraining/training/gh-pages/candidates/internal.json',
			success: function(data){
				defer.resolve(JSON.parse(data));
			},
			error: function(error){
				defer.reject(error);
			}
		});

		defer.promise.then(function(response){
			result = response.map(function(item){
				var nameArray = item.Name.split(' ');
				var obj = {
					name: nameArray[0].toLowerCase() + '.' + nameArray[2].toLowerCase()
					};
				obj.url = rootUrl + obj.name + suffix;

				return obj;
			});
			// console.log(JSON.stringify(result, '', 4));
			// tryFoo(result);
		}, function(error){
			console.log(error);
		});
	}

	function tryFoo(data){
		R.ajax({
			method: 'get',
			url: data[0].url,
			success: function(data){
				console.log(data);
			},
			error: function(error, headers){
				console.log(error, headers);
			}
		});
	}



})(window);
