import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Course } from './course';
import { Storage } from './storage.service';


@Injectable() export class CoursesService{
	private headers = new Headers({'Content-Type': 'application/json'});
	private coursesUrl = '/app/Base/courses.json';
	private storageKey = 'itscourses';

	constructor(
		private http: Http,
		private storage: Storage
	){}

	getCourses(): Promise<Course[]>{
		if(this.storage.getItem(this.storageKey)){
			return new Promise((resolve, reject) => { 
				resolve(JSON.parse(this.storage.getItem(this.storageKey)));
			}).then((response) => response as Course[]);
		} else {
			return this.http.get(this.coursesUrl)
				.toPromise()
				.then((response) => {
					this.storage.setItem(this.storageKey, JSON.stringify(response.json()));
					return response.json() as Course[];
				})
				.catch(this.handleError);
		}
	}
	private handleError(error: any): Promise<any>{
		console.warn('ITS HTTP Error:', error);
		return Promise.reject(error.message || error);
	}
}