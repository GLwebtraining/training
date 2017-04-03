'use strict';

import Menu from './menu';

let pandaMenu = new Menu({
	title: 'Panda\'s Menu',
	items: [{
		text: 'Eggs',
		href: '#eggs'
	},{
		text: 'Meat',
		href: '#meat'
	},{
		text: '99% of the foof is a bamboo',
		href: '#bamboo'
	},]
});

window.onload = function(){
	document.body.appendChild(pandaMenu.elem);
};