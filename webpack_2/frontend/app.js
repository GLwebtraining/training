'use strict';


let users = [
	{id: '1', name: 'Vasya'},
	{id: '2', name: 'Petya'},
	{id: '3', name: 'Misha'}
];

console.log(_.map(users, 'name'));