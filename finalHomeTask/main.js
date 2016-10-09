var Utils = {
	enums: {
		alphabet: 'abcdefghijklmnopqrstuvwxyz',
		numbers: '0123456789',
		sex: ['Male', 'Female']		
	},
	capitalize: function(str){
		return str.charAt(0).toUpperCase() + str.slice(1);;
	},
	randomFromRange: function(range){
		return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
	},
	randomFloatFromRange: function(range, toPosition){
		return Number((Math.random() * (range[1] - range[0] + 1) + range[0]).toFixed(toPosition || 2));
	},
	generator: {
		string: function(array, range, prefix, postfix){
			var size = Utils.randomFromRange(range);
			if (size === 0) {
				return array[0];
			}
			var string = '';
			for(var i = 0; i < size; i++){
				string += array[Utils.randomFromRange([0, array.length - 1])];
			}
			return (prefix || '') + string + (postfix || '');			
		},
		collection: function(reducer, size){
			var emptyArray = new Array(size);
			for(var i = 0; i < size; i++){
				emptyArray[i] = reducer();
			}
			return emptyArray;
		},
		alphaCode: function(size){
			var code = '';
			for(var i = 0; i < size; i++){
				code += Utils.capitalize(Utils.generator.string(Utils.enums.alphabet, [1, 1]));
			}
			return code;
		}
	}
};

function generateUser(){
	return {
		firstName: Utils.capitalize(Utils.generator.string(Utils.enums.alphabet.split(''), [3, 7])),
		lastName: Utils.capitalize(Utils.generator.string(Utils.enums.alphabet.split(''), [5, 10])),
		sex: Utils.generator.string(Utils.enums.sex, [0, 1]),
		age: Utils.randomFromRange([16, 100])
	}
}

function generateExtra(){
	return {
		phone: Utils.generator.string(Utils.enums.numbers.split(''), [10, 10]),
		email: Utils.generator.string(Utils.enums.alphabet.split(''), [10, 10], null, '@test.com')
	}
}

function User(attrs){
	this.firstName = attrs.firstName;
	this.lastName = attrs.lastName;
	this.sex = attrs.sex;
	this.age = attrs.age;
}

User.prototype = {
	getFullName: function(){
		return this.firstName + ' ' + this.lastName;
	},
	getUserInfo: function(){
		return this;
	}
};

function Contact(name, user, extra){
	this.name = name;
	this.person = user.getUserInfo();
	this.phone = extra.phone;
	this.email = extra.email;
}

Contact.prototype = Object.create(User.prototype);
Contact.prototype.getFullName = function(){
	return User.prototype.getFullName.call(this.person);
};
Contact.prototype.constructor = Contact;

var contactList = [];
function createContact(contactName, person, extraInfo){
	contactList.push(new Contact(contactName, person, extraInfo));
}

var userList = Utils.generator.collection(generateUser, 20);
userList.forEach(function(userSettings){
	createContact(Utils.generator.string(Utils.enums.alphabet.split(''), [4, 10]), new User(userSettings), generateExtra());
});

console.log(contactList);

function Currency(){
	this.alphaCode = Utils.generator.alphaCode(3);
	this.buy = Utils.randomFloatFromRange([20, 21]);
	this.sell = Utils.randomFloatFromRange([22, 23]);
}

Currency.prototype = {};
