import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fields' })

export class StatusPipe implements PipeTransform {
	transform(items: any[], name: string, status: number): any {
		return items.filter(item => {
			if (!!name){
				status = null;
				return item.name.indexOf(name) !== -1;
			} else {
				return item.status === status
			}
		});
	}
}