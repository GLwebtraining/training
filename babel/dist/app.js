'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
//# sourceMappingURL=app.js.map
