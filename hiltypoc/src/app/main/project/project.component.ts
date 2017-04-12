import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../common/enum.service';

@Component({
	selector: 'project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss']
})


export class ProjectComponent implements OnInit {
	@Input() model: any;
	tabs = Tab;
	level: Object;
	deepCount: Number = 0;
	activeTab: number;
	ngOnInit(): void {
		this.activeTab = this.tabs.Project;
	}
	levelFirst(hierarchy): void {
		if (!hierarchy.hasOwnProperty('children')){
			hierarchy.children = [];
			hierarchy.children.push({name: 'Level 2'})
		} else {
			hierarchy.children.push({ name: 'Level 2' })
		}
	}
	addLevel(currentLevel): void {
		if (!currentLevel.hasOwnProperty('children')) {
			currentLevel.children = [];
			currentLevel.children.push({ name: 'Level N' })
		} else {
			currentLevel.children.push({ name: 'Level N' })
		}
	}
	removeLevel(currentLevel): void {
		let base = this.model.hierarchy;
		let foundObject = findObjectIndex(base, 'name', currentLevel.name);

		if (foundObject){
			foundObject.array.splice(foundObject.index, 1);
			if (!foundObject.array.length){
				// delete foundObject.object.children;
			}
		}

		function findObjectIndex(base, key, val) {
			if (base.children && base.children.length) { 
				for (var i = 0; i < base.children.length; i++) {
					let o = base.children[i];
					if (o.hasOwnProperty(key) && o[key] === val) {
						return {
							object: base,
							array: base.children,
							index: i
						}
					} else {
						if (findObjectIndex(o, key, val) == null) {
							continue;
						} else {
							return findObjectIndex(o, key, val);
						}
					}
				}
			}
			return null;
		}
	}
	toggleLevel(isOpen): void {
		console.log(isOpen);
	}
}
