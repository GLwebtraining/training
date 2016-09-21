let myO = {
	a: 1,
	b: 2,
	get(){
		setTimeout(() => console.log(this.a));
	}
};

class User {
	constructor(firstName, lastName){
		this.firstName = firstName;
		this.lastName = lastName;
	}

	get fullName(){
		return this.firstName + ' ' + this.lastName;
	}

	info(){
		console.log(`User information: \nFirst name: ${this.firstName}, Last Name: ${this.lastName}`);
	}

	static checkLength(obj){
		const name = obj.fullName;
		return name.length;
	}
};

class Programmer extends User {
	constructor(firstName, lastName, skill){
		super(firstName, lastName);
		this.skill = skill;
	}

	info(){
		super.info();
		console.log(`Major skill: ${this.skill}`);
	}
}

var vadim = new User('Vadim', 'Reznik');
console.log(vadim);

var devVadim = new Programmer('Vadim', 'Reznik', 'javascript');
console.log(devVadim);