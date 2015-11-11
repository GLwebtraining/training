var App = {
	defaults: {
		width: 5,
		color: ['#39f', '#000', '#f00','#ff0','#0f0','#0ff','#f0f','#fff'],
		visibility: true,
		position: 'center'
	},
	initialize: function () {
		App.define();
		jQuery('#load-ajax-text').click(function(){
			jQuery.ajax({
				url: 'http://welike.com.ua/simple.php',
				success: function(data){
					alert(data);
				}
			});
		});
	},
	define: function () {
		App.playerHolder = jQuery('.player').eq(0);
		App.player = App.playerHolder.find('video');
		App.playerStyles = App.playerHolder.find('.styles');
		App.playerHandle = App.playerHolder.find('.handle');

		App.playerStyles.borderWidth = App.playerStyles.find('.border-width');
		App.playerStyles.borderColor = App.playerStyles.find('.border-color');
		App.playerStyles.showHide = App.playerStyles.find('.player-show-hide');
		App.playerStyles.pullLeft = App.playerStyles.find('.player-pull-left');
		App.playerStyles.pullRight = App.playerStyles.find('.player-pull-right');
		App.playerStyles.reset = App.playerStyles.find('.reset');

		App.playerHandle.playStop = App.playerHandle.find('.player-play-pause');
		App.playerHandle.stop = App.playerHandle.find('.player-stop');
		App.playerHandle.jump = App.playerHandle.find('.player-jump');


		var w = App.defaults.width,
		    	t = 0;

		App.playerStyles.borderWidth.click(function(){
			w--;
			if(w <= 0) w = App.defaults.width;
			App.player.css({borderWidth: w});
			return false;
		});

		App.playerStyles.borderColor.click(function(){
			var c = App.defaults.color[t],
			l = App.defaults.color.length;

			t++;
			if(t >= l) t = 0;
			App.player.css({borderColor: App.defaults.color[t]});
			return false
		});

		App.playerStyles.showHide.click(function(){
			App.playerStyles.showHide.text( App.player.toggle().is(':visible') ? 'Hide' : 'Show');
			return false
		});

		App.playerStyles.pullLeft.click(function(){
			App.player.css({float: 'left'});
			return false
		});

		App.playerStyles.pullRight.click(function(){
			App.player.css({float: 'right'});
			return false
		});

		App.playerStyles.reset.click(function(){
			App.player.attr('style','');
			return false
		});

		App.playerHandle.playStop.click(App.playing);
		App.playerHandle.jump.click(App.jumping);
		App.playerHandle.stop.click(App.stop);
	},
	playing: function(){
		if(App.player[0].paused){
			App.player[0].play();
			App.playerHandle.playStop.text('Pause');
		}
		else{
			App.player[0].pause();
			App.playerHandle.playStop.text('Play');
		}
		return false
	},
	jumping: function(){
		App.player[0].currentTime += 5;
		return false
	},
	stop: function(){
		if(!App.player[0].paused) App.playing();
		App.player[0].currentTime = 0;		
		return false
	}
};

jQuery(App.initialize);
