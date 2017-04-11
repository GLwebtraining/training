var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Human = (function () {
    function Human(name) {
        this.name = name;
    }
    Human.prototype.greet = function () {
        return 'Hello, my name is ' + this.name;
    };
    return Human;
}());
Human.legs = 2;
// let firstHuman = new Human('Adam');
// console.log(firstHuman, firstHuman.greet(), Human.legs);
var Student = (function (_super) {
    __extends(Student, _super);
    function Student(name, age) {
        var _this = _super.call(this, name) || this;
        _this.age = age;
        return _this;
    }
    Student.prototype.speak = function () {
        return 'Bla-bla-bla';
    };
    Student.prototype.greet = function () {
        return _super.prototype.greet.call(this) + ' and I am ' + this.age + ' years old';
    };
    return Student;
}(Human));
var Tod = new Student('Tod', 25);
var Bob = new Student('Bob', 27);
console.log(Tod, Tod.greet(), Tod.speak());
console.log(Bob, Bob.greet(), Bob.speak());
function buildName(firstName) {
    var restOfName = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOfName[_i - 1] = arguments[_i];
    }
    return firstName + " " + restOfName.join(" ");
}
var buildNameFun = buildName;
console.log(buildNameFun("Joseph", "Samuel", "Lucas", "MacKinzie"));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
console.log(Direction);
