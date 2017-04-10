import { Component, Input } from '@angular/core';

@Component({
  selector: 'tree',
  template: `
	<ul>
		<li *ngFor="let level of level?.children">
			<span>{{level.name}}</span>
  			<tree [level]="level"></tree>
		</li>
	</ul>
  `
})
export class TreeComponent {
	@Input() level;
}
