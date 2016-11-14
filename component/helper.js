"use strict";

var helper = {
	extend : function (base, params) {
		var key;
		for (key in params) {
			base[key] = params[key];
		}
		return base;
	},
	ajax : function (settings) {
		var defaults = helper.extend({
				url : '',
				method : 'GET',
				success : function () {},
				error : function () {}
			}, settings),
			xmlhttp;

		if (defaults.url === '') {
			throw new Error('URL is missed');
		} else {
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open(defaults.method, defaults.url, true);
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200 || xmlhttp.status === 0) {
						if (typeof defaults.success === 'function') {
							defaults.success(xmlhttp.responseText);
						}
					} else if (typeof defaults.error === 'function') {
						defaults.error(xmlhttp.responseText);
					}
				}
			};
			try {
				xmlhttp.send(null);
			} catch (e) {
				if (typeof defaults.error === 'function') {
					defaults.error(e.message);
				}
			}
		}
	},
	template : function (html) {
		return function (obj) {
			var key, text = '', matches = html.match(/\|\S+\|/g);
			text = html.replace(/\|(\S+)\|/g, function(match, key){
				return obj[key];
			});
			return text;
		};
	},
	css: function(node, obj){
		for(var style in obj){
			node.style[style] = obj[style];
		}
		return node;
	},
	notification: function(mode, text){
		var timer, notification;
		if(!document.querySelector('div.notification')){
			notification = document.createElement('div');
			notification.className = 'notification';
			this.css(notification, {
				width: '20%',
				margin: '0 0 0 -10%',
				textAlign: 'center',
				border: '1px solid #000',
				backgroundColor: '#fff',
				padding: '20px',
				position: 'fixed',
				bottom: '0',
				left: '50%',
				borderRadius: '5px',
				display: 'none'
			});
			document.body.appendChild(notification);
		}
		notification = document.querySelector('div.notification');
		if(mode === 'error'){
			notification.style.borderColor = '#f00';
		}
		return {
			show: function(){
				notification.innerHTML = text;
				notification.style.display = 'block';
				if(timer) clearTimeout(timer);
				timer = setTimeout(function(){
					notification.style.display = 'none';
				}, 2000);
			}
		};
	}
};