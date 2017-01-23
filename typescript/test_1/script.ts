class Student{
	fullName: string;
	constructor(public firstName, public middleInitial, public lastName) {
		this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
	}
}


interface Person{
	firstName: string,
	lastName: string
}

function greeter(person: Person){
	return "Hello, " + person.firstName + ' ' + person.lastName;
}

window.onload = function(){
	var user = new Student('Vadim', 'I.', 'Reznik');
	document.body.innerHTML = greeter(user);

	// boolean
	let isDone: boolean = false;

	// numbers
	let decimal: number = 6;
	let hex: number = 0xf00d;
	let binary: number = 0b1010;
	let octal: number = 0o744;

	// strings
	let color: string = "blue";
	color = 'red';

	let fullName: string = `Bob Bobbington`;
	let age: number = 37;
	let sentence: string = `Hello, my name is ${fullName}.
I'll be ${ age + 1} years old next month.`;

	console.log(sentence);

	// arrays
	let list1: number[] = [1, 2, 3];
	let list2: Array<number> = [1, 2, 3];

	// tuple
	// Declare a tuple type
	let x: [string, number];
	// Initialize it
	x = ["hello", 10]; // OK
	// Initialize it incorrectly
	// x = [10, "hello"]; // Error
	console.log(x[0].substr(1)); // OK
	// console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'

	x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

	// console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

	// x[6] = true; // Error, 'boolean' isn't 'string | number'

	// enums
	enum Color { Red, Green, Blue };
	let c: Color = Color.Green;

	enum Color1 { Red = 1, Green, Blue };
	let c1: Color1 = Color1.Green;

	enum Color2 { Red = 1, Green = 2, Blue = 4 };
	let c2: Color2 = Color2.Green;

	enum Color3 { Red = 1, Green, Blue };
	let colorName: string = Color3[2];

	console.log(colorName);

	// any
	let notSure: any = 4;
	notSure = "maybe a string instead";
	notSure = false; // okay, definitely a boolean

	let list: any[] = [1, true, "free"];

	list[1] = 100;

	// void
	function warnUser(): void {
		console.log("This is my warning message");
	}

	// Null and Undefined
	let u: undefined = undefined;
	let n: null = null;

	// Never
	// Function returning never must have unreachable end point
	function error(message: string): never {
		throw new Error(message);
	}

	// Inferred return type is never
	function fail() {
		return error("Something failed");
	}

	// Function returning never must have unreachable end point
	function infiniteLoop(): never {
		while (true) {
		}
	}

	// Type assertions
	let someValue: any = "this is a string";

	let strLength: number = (<string>someValue).length;

	let someValue1: any = "this is a string";

	let strLength1: number = (someValue as string).length;

};