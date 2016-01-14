$(function(){
	
	init360();
	
});

function init360(){
	var holder = $('.gallery-360');
	var list = holder.find('.list-360');
	var items = list.children();
	
	var controls = holder.find('.controls');
	var next = controls.find('a.next');
	var prev = controls.find('a.prev');
	var start = controls.find('a.start');
	var stop = controls.find('a.stop');
	var anim = controls.find('a.anim');
	
	var active = 0;
	var size = items.length;
	var delay = 70;
	var timer;
	var isAnim = false;
	var method = 'css';
	var forceStop = false;
	var animDuration = 100;
	
	items.not(':eq(' + active + ')').css({ opacity: 0 });
	
	anim.click(function(){
		isAnim = !isAnim;
		if(!isAnim){
			method = 'css';
			$(this).removeClass('active');
			delay = 70;
			animDuration = 100;
		} else {
			method = 'animate';
			$(this).addClass('active');
			delay = 400;
			animDuration = 300;
		}
		return false;
	});
	
	start.click(function(){
		forceStop = false;
		controls.find('a:not(.anim)').removeClass('active');
		$(this).addClass('active');
		autoShow();
		return false;
	});
	
	stop.click(function(){
		controls.find('a:not(.anim)').removeClass('active');
		$(this).addClass('active');
		if(!isAnim){
			if(timer){
				clearTimeout(timer);
			}
		} else {
			forceStop = true;
			if(timer){
				clearTimeout(timer);
			}
		}
		return false;
	});
	
	next.click(function(){
		nextSlide();
		return false;
	});
	
	prev.click(function(){
		prevSlide();
		return false;
	});
	
	function autoShow(){
		if(!forceStop){
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(function(){
				nextSlide();
				if(!isAnim){
					autoShow();
				}
			}, delay);
		}
	}
	
	function nextSlide(){
		items.eq(active)[method]({ opacity: 0 }, {queue: false, duration: animDuration});
		active++;
		if(active >= size){
			active = 0;
		}
		items.eq(active)[method]({ opacity: 1 }, {queue: false, duration: animDuration, complete: autoShow});
	}	
	
	function prevSlide(){
		items.eq(active).css({ opacity: 0 });
		active--;
		if(active < 0){
			active = size-1;
		}
		items.eq(active).css({ opacity: 1 });
	}
}