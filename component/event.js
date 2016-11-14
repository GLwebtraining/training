var Events = (function(){
	var channels = {};
	var hop = channels.hasOwnProperty;

	return {
		subscribe: function(name, handler){
			if(!hop.call(channels, name)){
				channels[name] = [];
			}
			var index = channels[name].push(handler) - 1;

			return {
				remove: function(){
					delete chanhels[name][index];
				}
			};
		},
		publish: function(name, extra){
			if(!hop.call(channels, name)){
				return;
			}
			channels[name].forEach(function(handler){
				handler(extra);
			});
		}
	};
})();