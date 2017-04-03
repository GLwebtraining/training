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
    return "Hello, " + person.firstName + ' ' + person.lastName + '.';
}
window.onload = function () {
    var user = new Student('Vadim', 'I.', 'Reznik');
    document.body.innerHTML = greeter(user);
};
//# sourceMappingURL=app.js.map