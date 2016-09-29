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

function g({name: x}) {
  console.log(x);
}

g({name: 5});

function r({x, y, w = 10, h = 10}) {
  return x + y + w + h;
}

r({x:1, y:2}) === 23;

function f(x, y=12) {
  // y is 12 if not passed (or passed as undefined)
  return x + y;
}
f(3) == 15

function f(x, ...y) {
  // y is an Array
  return x * y.length;
}
f(3, "hello", true) == 6;

function f(x, y, z) {
  return x + y + z;
}
// Pass each elem of array as argument
f(...[1,2,3]) == 6;

let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0, cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur }
      }
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}
var s = new Set();
console.log(s);
s.add("hello").add("goodbye").add("hello");
console.log(s.size === 2);

console.log(s);
s.has("hello") === true;

// Maps
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
m.get(s) == 34;
console.log(m);

// Weak Maps
var wm = new WeakMap();
wm.set(s, { extra: 42 });
wm.size === undefined;

const items = [1,2,3];

// good
const itemsCopy = [...items];





