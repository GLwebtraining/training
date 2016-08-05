/**
 * Вивчення JavaScript
 * Урок 12. Теми:
 * 	Функції:
        Вирощування функцій
        Функції і побічні ефекти
        Шаблони JavaScript
 *
 *
 * Щоб завантажити урок у Шелл:
 * Core.Load('../../lessons/lesson-14/l-14.js');
 */

Core.Print('\nLesson 12 - Start');

// JS Closures - Classical Definition
// https://developer.mozilla.org/en/docs/Web/JavaScript/Closures

// Closures are functions that refer to independent (free) variables (variables
// that are used locally, but defined in an enclosing scope). In other words, these
// functions 'remember' the environment in which they were created.

// Замикання є функціями, які посилаються на незалежні (вільні) змінні (тобто
// змінні, які використовуються локально, але визначені в рамках замикаючої області
// видимости). Іншими словами, ці функції "пам'ятають" навколишнє середовище, в якому
// вони були створені.


// 1. PATTERN: NAMESPACE: Global Var (ONLY ONE)
var MYAPP = {};

// 2. PATTERN: Immediate Function:

// 3. PATTERN: Private and Priveleged Members:



//
// Дилема "швидкість проти елегантності"
//

// Основне правило, яке повторюється багатьма програмістами і увійшло в правила
// екстреального програмування: не турбуватися про швидкість, поки ви не знаєте
// напевне, що програма працює занадто повільно.



// 1. PATTERN: NAMESPACE: Global Var (ONLY ONE)
var MYAPP = {};

// 2. PATTERN: Immediate Function:

// 3. PATTERN: Private and Priveleged Members:

// 4. PATTERN: Dependency Declarations

// All Public:
// var student = {
//   name: 'Petro',
//   address: 'Kyiv',
//   getInfo: function() {
//     return this.name + ' ' + this.adress
//   }
// };

// Some Private:
function Student(sName, sAddress) {
  // PATTERN: Dependency Declarations
  var myAppModule = MYAPP;
  // var myOtherModule = MYOTHERMODULE;

  // Public Member
  this.name = sName;

  // Private Member
  var address = sAddress;

  // Privileged Member:
  this.getInfo = function() {
    return this.name + ', from ' + address;
  }
}

var s1 = new Student('Marichka', 'Lviv');
console.log ( s1.getInfo() );

(function(aa) {
  console.log('got aa = ' + aa);
  return aa + 'bb'
})(11);

'use strict';


MYAPP.console = {
  log: function(arg) {
    Core.Print('LOG:', arg);
  }
};

//
// Функції і побічні ефекти
//

MYAPP.lessons = [];

MYAPP.lessons.push(14);

MYAPP.y = function(x) {
  // console.log(x);
  return x + 188;
};

MYAPP.z = function() {
  // console.log(MYAPP.lessons);
};

MYAPP.z(); // [14]
MYAPP.y(1); // 1
MYAPP.z(); // []

MYAPP.zeroPad = function(num, numWidth) {
  var numString = String(num);
  while (numString.length < numWidth) {
    numString = '0' + numString;
  }
  return numString;
};

MYAPP.printFarm = function(cows, chickens, pigs) {
  // console.log(MYAPP.zeroPad(cows, 3) + ' Cows');
  // console.log(MYAPP.zeroPad(chickens, 3) + ' Chickens');
  // console.log(MYAPP.zeroPad(pigs, 3) + ' Pigs');
};

MYAPP.printFarm(8, 200, 30);
