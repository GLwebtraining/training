/** 
 * Урок 3
 *  - Спеціальні типи даних
 *  - Складний тип: Object, Array, Function
 *  - Області видимости
 * 
 * Щоб завантажити урок у Шелл:
 * Core.Load('../../lessons/03/l-03.js');
 */

// Спочатку було слово, і воно було:
'use strict';

// Прості типи:

// String:
var lessonName = 'Javascript Lesson 3. Deeper to data types';

// Number:
var lessonId = 2;

// Boolean
var isSkyBlue = true;

// Спеціальні типи:
// Null
var empty = null;

// Undefined
var notInitialized; // undefined

// Складний тип: Object
var lesson = {
	name: 'Lesson 03 - Data Types (continued)',
	id: 3,
	folder: null,
	checkHomework: function ( students ) {
		// TODO
	}
};

// Об'єкт є колекцією значень (як простих, таких як числа і рядки, так і складних — наприклад об'єктів).
// Об'єкт може бути представлений як неупорядкована колекція іменованих значень 
// або як упорядкована колекція пронумерованих значень (масив) (array).
// 

// Об'єкт - це колекція іменованих значень, які зазвичай називають властивостями (properties) об'єкта.

// Властивості об'єктів багато в чому схожі на змінні: вони можуть містити будь-який тип даних, 
// включаючи масиви, функції та інші об'єкти.

// Об'єкти в JavaScript можуть виступати в якості асоціативних масивів, тобто асоціювати 
// довільні значення з довільними рядками. 
// При такій роботі з об'єктом використовується спеціальний синтаксис 
// для доступу до властивостей: рядок, що містить ім'я потрібної властивості, записується всередині квадратних дужок:

Core.Print( lesson.name );
Core.Print( lesson['name'] );

// 
// Тип масив — Array
// 
// Масив (array), як і об'єкт, є колекцією значень. Але якщо кожне значення, що міститься в об'єкті, 
// має ім'я, то в масиві кожне значення має номер, або індекс. У JavaScript можна брати значення з масиву, 
// вказавши після імені масиву індекс, укладений у квадратні дужки:

var plainNumbersArray = [1, 2, 3, 5, 7, 11, 13, 17, 19];
var firstElement = plainNumbersArray[0]; // 1
var thirdElement = plainNumbersArray[2];

Core.Print('Third element = ' + thirdElement );

// Нумерація елементів масиву починається з нуля, тому у прикладі вище написано [2], 
// а не [3] для отримання третього елементу.

// Масиви можуть містити будь-який тип даних JavaScript, в тому числі посилання на 
// інші масиви або на об'єкти або функції.

var people = [];
people['Anya'] = new Object();
people['Marichka'] = new Object();
people['Taras'] = new Object();

// Can use spaces here:
// Core.Print( people['Anya 1'] ); 

// And can't use spaces there:
// Core.Print( people.Anya 1); // 

// Крім функцій і масивів в базовій мові JavaScript визначено ще 
// кілька спеціальних видів об'єктів.

// Ці об'єкти являють собою не нові типи даних, а лише класи об'єктів.

// Клас Date визначає об'єкти, що представляють дати, 
// Клас RegExp – об'єкти, регулярних виразів, 
// Класс Error – об'єкти, що представляють синтаксичні помилки і помилки часу виконання.

// 
// Тип 'функція' — Function
// 

// Функція - це фрагмент коду, який визначений програмістом або визначений 
// заздалегідь у реалізації JavaScript (наприклад, Math.abs())

// У функції можуть передаватися параметри (аргументи) для 
// подальшої обробки даною функцією (наприклад, обчислень); 
// також функція може повертати значення-результат.

// Функції можуть зберігатися в змінних, масивах та об'єктах, 
// а також передаватися у якості аргументів інших функцій 
// (тоді вони називаються callbacks - функції зворотнього виклику).

function getMinValue( a, b, c ) {
	var result = a;

	if ( result > b ) {
		result = b;
	}

	if ( result > c ) {
		result = c;
	}

	return result;
}

// 1. 
function checkHomework ( students, moreParams ) {
	return students + moreParams;
}

// 2. 
var checkHomework2 = function( students, moreParams ) {
	return students + moreParams;
}

// 
// Reference to Function v.s. Function Execution
// 

// 1. Reference to Function, no braces:
Core.Print( checkHomework );

// 2. Function Execution, braces used: ()
Core.Print( checkHomework() );

// 1. Reference to Function, no braces:
var myNumber = Math.random;

Core.Print( myNumber ); // NaN 

// 2. Function Execution, braces used: ()
var myNumber = Math.random();

// () - Function Call

Core.Print( myNumber );

Core.Print( checkHomework( ['Nastya', 'Taras'], null ) );

// 
// Scope - області видимости: Global v.s. Local
//

// 1. Global Variable:
var myName = 'Rost';

function getMyName () {
	var myName;
	// 2. Local Variable:
	Core.Print( myName ); // undefined
	var myName = 'Mykyta';
	Core.Print( myName ); // Mykyta
}

getMyName();

Core.Print( myName ); // Rost

// 
// Variables Hoisting: moving declarations to the top;
// 

Core.Print( pi ); // undefined
var pi = 3.14;
Core.Print( pi ); // 3.14

//
// Callbacks - функції зворотнього виклику
//

// 
// Example 1: Load Data (like in front-end development):
// 

// function getTheDataAndCallBack( url, data, callbackFunction ) {
// 	var fullUrl = 'http://go.global.com/' + url;
// 	var result = AJAX.get( { 
// 		url: fullUrl,
// 		data: data,
// 		success: callbackFunction,
// 		error: callbackFunction
// 	});
// 	return result;
// }

// 
// Example 2: Like in real l
// 

function getToTheShopAndCallBack ( callbackFunction ) {
	// Local
	var cellPhones = ['Phone 1', 'Phone 2', 'Phone 3'];
	var chosenPhone = callbackFunction( cellPhones );
	return chosenPhone;
}

function chooseThePhone( cellPhones ) {
	var result = cellPhones[0];

	Core.Print( 'I need a phone ' + result );
	return result;
}

getToTheShopAndCallBack( chooseThePhone );



// Rost: Homework for Lesson 01

// Objects can be nested

// Q: What is the limit of object nesting?
// A: No limit (theoretically)

var myCar = {
	body: {
		front: {

		},
		rear: {

		}
	},
	wheels: [1,2,3,4]
}

// JavaScript Functional Reference Depth Limit

// There should be no inherent limit to nested objects in 
// Javascript that is dependent on the particular design implementation. 
// It should depend on the amount of memory that is available to the Javascript runtime.
// http://stackoverflow.com/questions/15974942/javascript-functional-reference-depth-limit


//
// Домашня робота:
//

var student = {
	name: 'name_value',
	surname: 'surname_value'
};

Core.Print( student.name ); // 'name_value'

Core.Print('\nLesson 3 - Homework');

Core.Print('\nTask 3.1');
// Task 3.1. Вище у коді визначено об'єкт student. 
// Додайте до нього властивість birthday, задавши початкове значення у форматі new Date(1991,8,24);
// TODO: пишіть свій код тут

Core.Print('\nTask 3.2');
// Task 3.2. Додайте до об'єкту student метод getDaysToBirtday, який буде повідомляти, 
// скільки днів залишилося до дня народження студента.
// TODO: пишіть свій код тут

Core.Print('\nTask 3.3');
// Task 3.3. необов'язково: викличте нову помилку типу Error з 
// довільним повідомленням про помилку.
// TODO: пишіть свій код тут

Core.Print('\nTask 3.4');
// Task 3.4. Почитати про функції тут:
// TODO: 
// 
// https://habrahabr.ru/post/240349/

Core.Print('\nLesson 3 - Homework End');
