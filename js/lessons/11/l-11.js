/**
 * Вивчення JavaScript
 * Урок 11. Функції:
 * 	Замикання (завершення, приклади)
 * 	Анонімні функції
 * 	Рекурсія
 *
 * Щоб завантажити урок у Шелл:
 * Core.Load('../../lessons/11/l-11.js');
 */

Core.Print('\nLesson 11 - Start');

 /* В програмуванні, замиканням (англ. closure) називається підпрограма,
 що виконується в середовищі, що містить одну або більше зв'язаних змінних.
 Під час виконання, підпрограма має доступ до цих змінних.

 Застосування замикань асоціюється з функціональним програмуванням.
 Такі конструкції, як об'єкти в інших мовах програмування,
 в функціональному програмуванні можуть моделюватись із допомогою замикань.

 В деяких мовах програмування замикання створюється для підпрограм,
 що визначаються всередині інших підпрограм, і внутрішня підпрограма
 має доступ до локальних змінних зовнішньої підпрограми.
 Під час виконання, коли обчислюється зовнішня підпрограма,
 утворюється замикання, до якого потрапляє код внутрішньої підпрограми,
 та посилання на ті змінні зовнішньої підпрограми,
 що використовуються у внутрішній підпрограмі.

 Посилання на змінні зовнішньої підпрограми залишаються дійсними всередині
 вкладеної внутрішньої підпрограми до тих пір, поки існує ця вкладена підпрограма,
 навіть коли зовнішня підпрограма закінчила виконання і вийшла з області видимості.
 */

 // https://uk.wikipedia.org/wiki/%D0%97%D0%B0%D0%BC%D0%B8%D0%BA%D0%B0%D0%BD%D0%BD%D1%8F_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F)

// Всі функції в JavaScript це замикання, коли задається функція — задається замикання.
// Так що замикання створюється при визначенні функції.
// Але треба розуміти різницю між створенням замикання і створенням нового scope-об'єкту:
// замикання[1] (функція + посилання на поточний ланцюжок scope-об'єктів)
// створюється при визначенні функції, але новий scope-об'єкт створюється
// (і використовується для модифікації ланцюжка scope-об'єктів замикання) при виклику функції.


// Ще один приклад замикання, з реального життя:
// 1. Петро подає на британську Візу у спецЦентрУКиєві -> МВСБританії(анкетаПетра)
// 2. Петро отримує відповідь від МВСБританії(): "Ваша заявка розглянута.
// Результат надіслано листом до спецЦентрУКиєві, де ви зможете цей результат взнати.
// 3. Петро забирає лист у спец. центрі і взнає результат.

//  У вигляді коду:

var traveller = {
	name: 'Petro',
	hasUKVisa: false,
	hasBusinessPartnerInUK: true,
	hasNecessaryDocs: true
};

// Closure Function
function makeVisaDecision(traveller) {
	var decision = 'rejected';
	if (traveller.hasBusinessPartnerInUK && !traveller.hasUKVisa) {
		decision = 'approved';
	}
	// Internal Function
	return function deployTheDecision() {
		return decision;
	}
}

// Apply For A Visa:
var myVisaDecisionLetter = makeVisaDecision( traveller );
// Reveal the decision:
var myVisaDecision = myVisaDecisionLetter();

console.log( traveller.name + '`s Visa is ' + myVisaDecision );

//
// Ще приклад замикання
//

function counter() {
	var count = 0;
	var internalFunction = function() {
		console.log( count++ );
	}
	return internalFunction;
}

// Замикання:
var iterator = counter();

iterator();
iterator();
iterator();
iterator();
iterator();
iterator();

// Q: Чи використовують більше ніж 1 рівень вкладеності замикань?
// A: Так, але розумно, щоб не заплутати код занадто сильно

// Приклад

function counterLevel1() {
	var cLevel1 = 0;
	var iteratorLevel1 = function() {
		var cLevel2 = 0;
		console.log( cLevel1++ );
		var iteratorLevel2 = function () {
			console.log( cLevel1++, cLevel2++ );
		}
		return iteratorLevel2;
	}
	return iteratorLevel1;
}

var iLevel1 = counterLevel1(); // === iteratorLevel1;

var iLevel2Instance1 = iLevel1(); // === iteratorLevel1 - Instance 1;
var iLevel2Instance2 = iLevel1(); // === iteratorLevel2 - Instance 2;
var iLevel2Instance3 = iLevel1(); // === iteratorLevel3 - Instance 3;

iLevel2Instance1();
iLevel2Instance1();
iLevel2Instance1();
iLevel2Instance2();
iLevel2Instance1();

//
// Рекурсія - Recursion
//

// Рекурсія - це коли функція викликає сама себе
// І має умови виходу з рекурсіі

function power(base, exponent) {
	if (exponent == 0) {
		return 1;
	} else {
		return base * power(base, exponent - 1);
	}
}

console.log(power(2, 3)); // STEP 0: 8

// STEP 1: base: 2, exponent: 3 => 2 * 4; // 4 is result from step2()
// STEP 2: base: 2, exponent: 2 => 2 * 2; // 2 is result from step3()
// STEP 3: base: 2, exponent: 1 => 2 * 1; // 1 is result from step4()
// STEP 4: base: 2, exponent: 0 => 1

// 2! = 1 * 2 = 2
// 3! = 1 * 2 * 3 = 6
// 4! = 1 * 2 * 3 * 4 = 24
// 5! = 1 * 2 * 3 * 4 * 5 = 120

function factorial(n) {
	if (n === 1) {
		return 1;
	} else {
		return n * factorial(n - 1);
	}
}

console.log(factorial(2));
console.log(factorial(3));
console.log(factorial(4));
console.log(factorial(5));
console.log(factorial(6));


//
// Анонімні функції
//

// Not anonymous:
// Оголошена іменована функція
function myNamedFunction() { }

// anonymous:
// функція-вираз, що не має ім'я
var myNamedFunction = function() { }

//
// IIFE - Функція, що викликається безпосредньо після оголошення:
// An immediately-invoked function expression (or IIFE, pronounced "iffy"[1])
// https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
//

(function(){})();

(function(){
	// All your code goes here:
	console.log(this)
})();



//
// Функції і побічні ефекти
//

// Без побічних ефектів працюють класичні функціі математики:
// y = f(x);
// Наприклад, факторіал:
var factorial6 = factorial(6);

// Але, console.log - приклад того, що інколи побічний ефект функції і є метою.


//
// Callback - функція
//

// 1. Повертаємо змінну із замикання без колбеку:

function counter() {
	var count = 0;
	var internalFunction = function() {
		console.log( count++ );
	}
	return internalFunction;
}

// 2. Повертаємо змінну із замикання без колбеку:

function loadData( success, fail ) {
	//var result = AJAX.load('http://gl.org/userData');
	var result = true;

	if ( result !== undefined ) {
		success(result, 'LOADED DATA');
	} else {
		fail(result, 'LOAD ERROR');
	}
}

function onSuccess ( result, response ) {
	console.log('load successful: ' + result + ', ' + response );
};

function onError ( result, error ) {
	console.log('load failed: ' + result + ', ' + error );
}

loadData( onSuccess, onError );

Core.Print('\nLesson 11 - End');

Core.Print('\nLesson 11 - Homework');

Core.Print('\nTask 11.1');
// (1 бал)
// Перечитай уважно файл уроку і дай відповідь:
// Чи є замиканнями обидві наведені нижче функції? Чому?
function func1() {
	var var1;
}

function func1() {
	var var1;
	return func1InternalFunc() {

	}
}

// TODO: дай відповідь тут:
// ОБИДВІ. Тому що всі функції є ними.

Core.Print('\nTask 11.2');
// (1 бал)
// Напиши функцію-замикання -- будь-яку.
// TODO: пиши код тут:

function sillyClosure() {
	return this;
}

console.log(sillyClosure())

Core.Print('\nTask 11.3');
// (1 бал)
// Є замикання iAmClosure із внутрішньою змінною iAmEnclosed.
// Як можна отримати доступ до цієї змінної?
function iAmClosure() {
	var iAmEnclosed = 'secret';
	return false;
}

// TODO: пиши відповідь словами тут:
// WRONG 1:
function iAmClosureTwo() {
	var iAmEnclosed = 'secret';
	return iAmEnclosed; // 'secret'
}

console.log(iAmClosureTwo()) // 'secret'

// WRONG 2:
function iAmClosureThree() {
	var iAmEnclosed = { property: 'secret', propertyAlso: 'also secret' };
	return iAmEnclosed;
}
// [[scope]] - створюється щоразу при виконанні функції
var disclosedInternal = iAmClosureThree();

// [[scope]] - створюється щоразу при виконанні функції
var brokenDisclosedInternal = iAmClosureThree();
// var brokenDisclosedInternal = disclosedInternal;

// READ
console.log( disclosedInternal );
console.log( brokenDisclosedInternal );

// WRITE -- OVERWRITTEN OBJECT
// BAD BAD BAD
disclosedInternal.property = 'secret2';

console.log( disclosedInternal );
console.log( brokenDisclosedInternal );



Core.Print('\nTask 11.4');
// (2 бали)
// Напиши функцію, до внутрішньої змінної якої можна
// отримати доступ через внутрішню функцію,
// що повертається як функція-замикання.
// TODO: пиши тут:

function iAmClosureFour() {
	var iAmEnclosed = { property: 'secret', propertyAlso: 'also secret' };

	function accessEnclosed() {
		return iAmEnclosed
	}

	return accessEnclosed;
}

var accessEnclosed = iAmClosureFour();
var disclosedInternalFour = accessEnclosed();


Core.Print('\nTask 11.5');
// (1 бал)
// Напиши приклад анонімної функції
// TODO: пиши тут:

// RIGHT:
function(){ return null })

// RIGHT ALSO + THIS IS IIFE because of () in the end
(function(){ return null })()
(function(){ return null }())

Core.Print('\nTask 11.6');
// (2 бали)
// Напиши функцію useAnonymousCallback, що приймає у якості параметра анонімну функцію.
// TODO: пиши тут:

function useAnonymousCallback( callback ) {
	return callback()
}

console.log(useAnonymousCallback(function () {
	return 'hello'
}));



Core.Print('\nTask 11.7');
// (2 бали)
// Напиши функцію useNamedCallback, що приймає у якості параметра іменовану функцію.
// TODO: пиши тут:


function useNamedCallback( callback ) {
	return callback()
}

function namedCallback() {
	return 'hello'
}

useNamedCallback( namedCallback );


Core.Print('\nTask 11.7');
// (3 бали)
// Напиши функцію workingCallback, що приймає у якості параметра іменовану функцію
// і викликає її, передаючи їй у якості параметра свою внутрішню змінну enclosed.
// Напиши код, що використовує цю конструкцію для того, щоб вивести у консоль
// значення змінної enclosed через замикання.
// TODO: пиши тут:

function workingCallback( callback ) {
	var enclosed = 'top secret';
	callback(enclosed);
}

function anotherNamedFunc(disclosed) {
	console.log('disclosed', disclosed + ' (was)');
}

function justNamedFunc(disclosed) {
	console.log('disclosed', disclosed);
	return disclosed;
}

workingCallback( justNamedFunc );
workingCallback( anotherNamedFunc );


// THE SAME, BUT NO CALLBACK:
function workingClosure( ) {
	var enclosed = 'top secret';

	function justNamedFunc(disclosed) {
		console.log('disclosed', disclosed);
		return disclosed;
	}

	justNamedFunc(enclosed);
}

workingClosure();








Core.Print('\nTask 11.7');
// (2 бали)
// Скільки способів отримання доступу до внутрішніх змінних замикання було
// використано при виконанні цієї дом. роботи? Назви їх або напиши коротко їх приклади.

// TODO: пиши відповідь тут:



Core.Print('\nLesson 11 - Homework End');
