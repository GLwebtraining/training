import { Component } from '@angular/core';

let hierarchy = {
	name: 'Level 2',
	children: [
		{
			name: 'Level 3',
			children: [
				{
					name: 'Level 4'
				}
			]
		},
		{
			name: 'Level 3',
			children: [
				{
					name: 'Level 4',
					children: [
						{
							name: 'Level 5',
							children: [
								{
									name: 'Level 6'
								}
							]
						}
					]
				}
			]
		}
	]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  level = hierarchy;
}
