var Student = (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + ' ' + person.lastName;
}
window.onload = function () {
    var user = new Student('Vadim', 'I.', 'Reznik');
    document.body.innerHTML = greeter(user);
    // boolean
    var isDone = false;
    // numbers
    var decimal = 6;
    var hex = 0xf00d;
    var binary = 10;
    var octal = 484;
    // strings
    var color = "blue";
    color = 'red';
    var fullName = "Bob Bobbington";
    var age = 37;
    var sentence = "Hello, my name is " + fullName + ".\nI'll be " + (age + 1) + " years old next month.";
    console.log(sentence);
    // arrays
    var list1 = [1, 2, 3];
    var list2 = [1, 2, 3];
    // tuple
    // Declare a tuple type
    var x;
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
    var Color;
    (function (Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Green"] = 1] = "Green";
        Color[Color["Blue"] = 2] = "Blue";
    })(Color || (Color = {}));
    ;
    var c = Color.Green;
    var Color1;
    (function (Color1) {
        Color1[Color1["Red"] = 1] = "Red";
        Color1[Color1["Green"] = 2] = "Green";
        Color1[Color1["Blue"] = 3] = "Blue";
    })(Color1 || (Color1 = {}));
    ;
    var c1 = Color1.Green;
    var Color2;
    (function (Color2) {
        Color2[Color2["Red"] = 1] = "Red";
        Color2[Color2["Green"] = 2] = "Green";
        Color2[Color2["Blue"] = 4] = "Blue";
    })(Color2 || (Color2 = {}));
    ;
    var c2 = Color2.Green;
    var Color3;
    (function (Color3) {
        Color3[Color3["Red"] = 1] = "Red";
        Color3[Color3["Green"] = 2] = "Green";
        Color3[Color3["Blue"] = 3] = "Blue";
    })(Color3 || (Color3 = {}));
    ;
    var colorName = Color3[2];
    console.log(colorName);
    // any
    var notSure = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean
    var list = [1, true, "free"];
    list[1] = 100;
    // void
    function warnUser() {
        console.log("This is my warning message");
    }
    // Null and Undefined
    var u = undefined;
    var n = null;
    // Never
    // Function returning never must have unreachable end point
    function error(message) {
        throw new Error(message);
    }
    // Inferred return type is never
    function fail() {
        return error("Something failed");
    }
    // Function returning never must have unreachable end point
    function infiniteLoop() {
        while (true) {
        }
    }
    // Type assertions
    var someValue = "this is a string";
    var strLength = someValue.length;
    var someValue1 = "this is a string";
    var strLength1 = someValue.length;
};
