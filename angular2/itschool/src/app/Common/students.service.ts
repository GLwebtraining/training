import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Student } from './student';
import { Storage } from './storage.service';


@Injectable() export class StudentsService {
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private studentsUrl = '/app/Base/students.json';
	private storageKey = 'itsstudents';

	constructor(
		private http: Http,
		private storage: Storage
	) { }

	getStudents(): Promise<Student[]> {
		if (this.storage.getItem(this.storageKey)) {
			return new Promise((resolve, reject) => {
				resolve(JSON.parse(this.storage.getItem(this.storageKey)));
			}).then((response) => response as Student[]);
		} else {
			return this.http.get(this.studentsUrl)
				.toPromise()
				.then((response) => {
					this.storage.setItem(this.storageKey, JSON.stringify(response.json()));
					return response.json() as Student[];
				})
				.catch(this.handleError);
		}
	}
	private handleError(error: any): Promise<any> {
		console.warn('ITS HTTP Error:', error);
		return Promise.reject(error.message || error);
	}
}