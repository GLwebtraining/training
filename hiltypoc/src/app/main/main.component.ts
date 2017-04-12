import { Component, ViewChild } from '@angular/core';
import { Enums, Status } from '../common/enum.service';
import { ModalComponent } from '../common/modal.component';

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
	selectedProject: Object = {};
	@ViewChild(ModalComponent) public readonly modal: ModalComponent;
	showDetails(project){
		this.selectedProject = project;
		this.modal.show();
	}
}
