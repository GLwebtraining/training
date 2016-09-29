'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var myO = {
	a: 1,
	b: 2,
	get: function get() {
		var _this = this;

		setTimeout(function () {
			return console.log(_this.a);
		});
	}
};

var User = function () {
	function User(firstName, lastName) {
		_classCallCheck(this, User);

		this.firstName = firstName;
		this.lastName = lastName;
	}

	_createClass(User, [{
		key: 'info',
		value: function info() {
			console.log('User information: \nFirst name: ' + this.firstName + ', Last Name: ' + this.lastName);
		}
	}, {
		key: 'fullName',
		get: function get() {
			return this.firstName + ' ' + this.lastName;
		}
	}], [{
		key: 'checkLength',
		value: function checkLength(obj) {
			var name = obj.fullName;
			return name.length;
		}
	}]);

	return User;
}();

;

var Programmer = function (_User) {
	_inherits(Programmer, _User);

	function Programmer(firstName, lastName, skill) {
		_classCallCheck(this, Programmer);

		var _this2 = _possibleConstructorReturn(this, (Programmer.__proto__ || Object.getPrototypeOf(Programmer)).call(this, firstName, lastName));

		_this2.skill = skill;
		return _this2;
	}

	_createClass(Programmer, [{
		key: 'info',
		value: function info() {
			_get(Programmer.prototype.__proto__ || Object.getPrototypeOf(Programmer.prototype), 'info', this).call(this);
			console.log('Major skill: ' + this.skill);
		}
	}]);

	return Programmer;
}(User);

var vadim = new User('Vadim', 'Reznik');
console.log(vadim);

var devVadim = new Programmer('Vadim', 'Reznik', 'javascript');
console.log(devVadim);

function g(_ref) {
	var x = _ref.name;

	console.log(x);
}

g({ name: 5 });

function r(_ref2) {
	var x = _ref2.x;
	var y = _ref2.y;
	var _ref2$w = _ref2.w;
	var w = _ref2$w === undefined ? 10 : _ref2$w;
	var _ref2$h = _ref2.h;
	var h = _ref2$h === undefined ? 10 : _ref2$h;

	return x + y + w + h;
}

r({ x: 1, y: 2 }) === 23;

function f(x) {
	var y = arguments.length <= 1 || arguments[1] === undefined ? 12 : arguments[1];

	// y is 12 if not passed (or passed as undefined)
	return x + y;
}
f(3) == 15;

function f(x) {
	// y is an Array
	return x * (arguments.length <= 1 ? 0 : arguments.length - 1);
}
f(3, "hello", true) == 6;

function f(x, y, z) {
	return x + y + z;
}
// Pass each elem of array as argument
f.apply(undefined, [1, 2, 3]) == 6;

var fibonacci = _defineProperty({}, Symbol.iterator, function () {
	var pre = 0,
	    cur = 1;
	return {
		next: function next() {
			var _ref3 = [cur, pre + cur];
			pre = _ref3[0];
			cur = _ref3[1];

			return { done: false, value: cur };
		}
	};
});

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = fibonacci[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var n = _step.value;

		// truncate the sequence at 1000
		if (n > 1000) break;
		console.log(n);
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
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

var items = [1, 2, 3];

// good
var itemsCopy = [].concat(items);
//# sourceMappingURL=app.js.map
