import { Injectable } from '@angular/core';

@Injectable() export class Storage {
	setItem(key: string, value: string): void {
		localStorage.setItem(key, value);
	}
	getItem(key: string): string {
		return localStorage.getItem(key);
	}
	clear(key: string): void {
		localStorage.removeItem(key);
	}
}