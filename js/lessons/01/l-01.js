/*
	JavaScript Lesson 01
	JS Language and its Types§.

	To load this lesson into Shell:
 	Core.Load('../../lessons/01/l-01.js');

	* * *

 	Q: What is Shell?
	A: Shell is your code execution environment, your console.

	To run it:
		1. Unpack shell.zip to the work directory (ask manager where's shell.zip).
		2. Run shell.exe
		3. Your JS Console is ready.

	To run test script file from console:
		1. Open test.js file in Notepad++
		2. Type test scenario
		3. To print any result into console use command:
				Core.Print("Hello World");
		4. To run test.js file use command from console:
				Core.Load('test.js');
		5. Core.Quit();
*/

// JavaScript is a language consisting of two kinds ot text:

// 1. Executable Code:
var a = 0;
// 2. Comments (this line)

// This way, we tell interpreter to use strict mode (use it please)
'use strict';

var helloWorld = 'Hello World';
helloWorld = 2016;

// variable = var
// Simple Data Types
var myNumber = 2016; // Number
var myString = 'Hello Again'; // String
var myBoolean = true; // Boolean - Logical type
var myNull = null; // Null
var myUndefined; // 'undefined', Type: Undefined
// var mySymbol = new Symbol();

// Complex Data Types:
// Object
var myObject = {
	myProperty: 'Only Mine',
	myOtherProp: 19,
	myObjProp: {
		myParent: {
			myParent: null
		}
	}
};

// Array
var myArray = [1,2,3,4,5, 'a string', true, { name: 'My Name'}];

// Function
function myFunction (parameter) {
	var myLocalVar = parameter;
	return myLocalVar * 2;
}

var fiveTimesTwo = myFunction(5); // returns 10 = 5 * 2;

// Date
var today = new Date(); //

// RegExp
// 1. Validation: Name.Email@domain.com
// 2. Find and Replace

// TODO ROST: Tell maximum size of Object and
// max children count for object.

function myFunction (parameter) {
	var myLocalVar = parameter;
	return myLocalVar * 2;
}

// TypeScript is "Typed Javascript"

// Jeff Atwood Law (http://stackoverflow.com/):
// "any application that can be written in JavaScript,
// will eventually be written in JavaScript."

//
// Why JS?
//

// JS Pluses:
// 1. Low entrance barrier: only need only browser
// (and Minecraft, and Shell, and NodeJS)
// 2. Free! Editors: Sublime Text, Notepad++, Aptana (Eclipse), JSFiddle
// 3. Easy to Debug.
// 4. Community and Rapid Dev: http://stackoverflow.com/ , https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
// 5. Libraries and Frameworks: (jQuery) (AngularJS, Backbone etc)
// 6. Desktop (NodeJS) Web Server
// 7. Build (NPM, Bower, Gulp)
// 8. Mobile (PhoneGap, Appcelerator Titanium)
// 9. Bridge to other languages. JS is a C-like lang.

// Lesson 01 - End

// Lesson 01 Homework - Start

// Task 01.01 - 1 point
// Question: How to load this file into Shell for exefcution (look for answer in this file)?
// Answer: TODO

// Task 01.02 - 1 point
// Question: What is EcmaScript?
// Answer: TODO

// Task 01.03 - 1 point
// Question: Can JavaScript file contain non-executable code?
// Answer: TODO

// Task 01.04 - 2 points
// Question: How we can tell the JS interpreter to use strict mode?
// Answer: TODO

// Task 01.05 - 2 points
// Q: What simple data types are used in JS?
// A: TODO

// Task 01.06 - 2 points
// Q: What complex data types are used in JS?
// A: TODO

// Task 01.07 - 3 points
// Q: Please write a function which calculates the difference between two numbers
// A: TODO

// Task 01.08 - 3 points
// Q: Please write what result did you get in console in Task 01.01
// A: TODO


// Lesson 01 Homework - End
