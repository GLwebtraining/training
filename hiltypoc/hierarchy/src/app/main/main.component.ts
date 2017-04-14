import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { Enums, Status } from '../common/enum.service';
import { ModalComponent } from '../common/modal.component';
import { GenerateInfo } from '../main/project/project.service';

@Component({
	selector: 'main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})


export class MainComponent {
	title = 'app works! Main';
	attrs: Object = Enums;
	status = Status;
	projectFilter = Status.Active;
	selectedProject: any = {};
	@ViewChild(ModalComponent) public readonly modal: ModalComponent;

	constructor(
		private generate: GenerateInfo
	) { }

	showDetails(project){
		this.selectedProject = this.generate.extend(project);
		this.modal.show();
	}
}
