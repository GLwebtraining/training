(function(){

	var modules = {
		require: function(name){
			for(var i = 0, l = this.cache.length; i < l; i ++){
				if(this.cache[i].name === name){
					return this.cache[i].obj;
				}
			}
			throw new Error('Module doesn\'t exist!');
			return null;
		},
		exports: function(name, obj){
			for(var i = 0, l = this.cache.length; i < l; i ++){
				if(this.cache[i].name === name){
					new Error('Module alredy defined!');
					return this.cache[i][name];
				}
			}
			this.cache.push({name: name, obj: obj});
		},
		cache: []
	};
	
	Object.defineProperties(modules, {
		test_exports: {
			set: function(){
				console.log(arguments);
				this.cache.push(1)
			}
		}
	});
	
	window.modules = modules;
	
})();