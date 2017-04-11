abstract class Human {
	name: string;
	static legs = 2;
	constructor(name){
		this.name = name;
	}
	abstract speak();
	public greet(){
		return 'Hello, my name is ' + this.name;
	}
}

// let firstHuman = new Human('Adam');

// console.log(firstHuman, firstHuman.greet(), Human.legs);

class Student extends Human {
	age: number;
	constructor(name: string, age: number){
		super(name);
		this.age = age;
	}
	speak():string{
		return 'Bla-bla-bla';
	}
	greet(){
		return super.greet() + ' and I am ' + this.age + ' years old';
	}
}

let Tod = new Student('Tod', 25);
let Bob = new Student('Bob', 27);

console.log(Tod, Tod.greet(), Tod.speak());
console.log(Bob, Bob.greet(), Bob.speak());

function buildName(firstName: string, ...restOfName: string[]) {
	return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
console.log(buildNameFun("Joseph", "Samuel", "Lucas", "MacKinzie"));

enum Direction {
	Up = 1,
	Down,
	Left,
	Right
}

console.log(Direction);