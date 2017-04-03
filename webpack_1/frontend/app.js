'use strict';

let users = [
	{id: '1', name: 'Vasya'},
	{id: '2', name: 'Petya'},
	{id: '3', name: 'Misha'}
];

console.log(_.pluck(users, 'name'));

window.onload = function(){
	document.getElementById('loginButton').onclick = function(){
		require.ensure([], function(require){
			let login = require('./login');

			login();
		}, 'auth');
	};

	document.getElementById('logoutButton').onclick = function(){
		require.ensure([], function(require){
			let logout = require('./logout');

			logout();
		}, 'auth');
	};
};