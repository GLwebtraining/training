console.log('------------- IT School ----------------');

var userList = Utils.generator.collection(generateUser, 10);
var courseList = [
	{
		name: 'Native JS',
		duration: 16,
		limit: 4
	},
	{
		name: 'Angular JS',
		duration: 9,
		limit: 3
	},
	{
		name: 'Node JS',
		duration: 6,
		limit: 2
	},
	{
		name: 'jQuery advanced',
		duration: 6,
		limit: 4
	},
	{
		name: 'Unit testing',
		duration: 2,
		limit: 2
	},
	{
		name: 'Performance and Optimization',
		duration: 3,
		limit: 2
	}
];

var School = function(){
	var count = 0;
	var courses = [];

	function addCourse(options){
		count++;
		options.id = count;
		courses.push(new Course(options));
		console.log('IT School added new course "' + options.name + '"(ID:' + options.id + ') to its training programm!');
	}
	function removeCourse(id){
		for(var i = 0; i < courses.length; i++){
			if(id === courses[i].id){
				console.log('IT School has removed the course "' + courses[i].name + '"(ID:' + courses[i].id + ') from its training programm!');
				courses[i].close();
				courses.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	function getCourses(){
		return courses.map(function(course){
			return course.name + '(ID:' + course.id + ')';
		});
	}

	function addToCourse(id, traineeData){
		var course = courses.filter(function(classItem){
			if(classItem.id === id){
				return classItem;
			}
		})[0];

		var isApplied = course.addTrainee(traineeData);
		if(isApplied) {
			console.log(traineeData.getName() + ' has been succesfully applied to the course "' + course.name + '"!');
			return {
				id: course.id,
				courseName: course.name
			};
		} else {
			console.log(traineeData.getName() + ' has been rejected!');
			return false;
		}
	}

	return {
		courses: courses,
		addCourse: addCourse,
		removeCourse: removeCourse,
		getCourses: getCourses,
		addToCourse: addToCourse
	}
}();

function Course(options){
	this.id = options.id;
	this.name = options.name;
	this.duration = options.duration;
	this.limit = options.limit;
	this.trainees = [];
}

Course.prototype = {
	addTrainee: function(trainee){
		var size = this.trainees.length;
		if(size < this.limit){
			var isAlreadyApplied = this.trainees.some(function(student){
				return student.email === trainee.email;
			});
			if(isAlreadyApplied){
				console.log(trainee.getName() + ' already applied to the course "' + this.name + '"!');
				return false;
			} else {
				this.trainees.push(trainee);
				return true;	
			}
		} else {
			console.log('There is no places on the course "' + this.name + '"! Try another one!');
			return false;
		}
	},
	removeTrainee: function(trainee){
		for(var i = 0; i < this.trainees.length; i++){
			if(trainee.email === this.trainees[i].email){
				console.log(trainee.getName() + 'has been removed from the course "' + this.name + '"!');
				trainee.unsubscribe(this.id);
				this.trainees.splice(i, 1);
				return true;
			}
		}
		return false;
	},
	close: function(){
		var current = this;
		var id = current.id;
		current.trainees.forEach(function(trainee){
			if(trainee.unsubscribe(id)){
				console.log(trainee.getName() + ' has been removed from the course "' + current.name + '(ID:' + current.id + ')" due to close it!');
			}
		});
	}
};

function Someone(setting){
	this.firstName = setting.firstName;
	this.lastName = setting.lastName;
	this.email = setting.email;
	this.age = setting.age;
	this.sex = setting.sex;
	this.phone = setting.phone;
	this.appliedTo = [];
}

Someone.prototype = {
	getName: function(){
		return this.firstName + ' ' + this.lastName;
	},
	getAppliedCourses: function(){
		return this.appliedTo.map(function(course){
			return course.courseName + '(ID: ' + course.id + ')';
		});
	},
	sendRequest: function(courseId){
		var courseApply = School.addToCourse(courseId, this);
		if(!!courseApply){
			this.appliedTo.push(courseApply);
		}
	},
	unsubscribe: function(courseId){
		for(var i = 0; i < this.appliedTo.length; i++){
			if(this.appliedTo[i].id === courseId){
				this.appliedTo.splice(i, 1);
				return true;
			}
		}
	}
};

var users = userList.map(function(userOpt){
	var extraInfo = generateExtra();
	userOpt.email = extraInfo.email;
	userOpt.phone = extraInfo.phone;

	return new Someone(userOpt);
});

console.log('People =', users);

courseList.forEach(function(courseOpt){
	School.addCourse(courseOpt);
});

console.log('Courses in ITS:', School.courses);

var userA = users[0];
var userB = users[1];
var userC = users[2];
var userD = users[3];
var userE = users[4];

userA.sendRequest(1);
userB.sendRequest(1);
userC.sendRequest(1);
userD.sendRequest(1);
userE.sendRequest(1);

userA.sendRequest(2);
userB.sendRequest(2);
userC.sendRequest(2);
userD.sendRequest(2);

userA.sendRequest(3);
userB.sendRequest(3);
userC.sendRequest(3);

userD.sendRequest(5);
userE.sendRequest(5);

console.log(userA.getAppliedCourses());
console.log(userB.getAppliedCourses());
console.log(userC.getAppliedCourses());
console.log(userD.getAppliedCourses());
console.log(userE.getAppliedCourses());

School.removeCourse(5);
console.log('Current courses in ITS:', School.getCourses());
console.log(userD.getAppliedCourses());
console.log(userE.getAppliedCourses());

var nativeJSCourse = School.courses[0];
nativeJSCourse.removeTrainee(userD);
console.log(userD.getAppliedCourses());