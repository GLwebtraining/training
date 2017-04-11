import { ViewEncapsulation, Component, OnInit } from '@angular/core';

import { Course } from './Common/course';
import { Student } from './Common/student';

import { Storage } from './Common/storage.service';
import { CoursesService } from './Common/courses.service';
import { StudentsService } from './Common/students.service';



@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None, // to remove tag[_ngcontent-xxx-N]
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
	courses: Course[];
	students: Student[];

  	constructor(
			private courseService: CoursesService,
			private studentService: StudentsService,
			private storage: Storage
  		){}
  	
	getCourses(): void {
		this.courseService.getCourses().then((courses) => {
			this.courses = courses;
		});
	}
	getStudents(): void {
		this.studentService.getStudents().then((students) => {
			this.students = students;
		});
	}
	ngOnInit():void {
	  this.getCourses();
	  this.getStudents();
	}

	title = 'ITS';


}
