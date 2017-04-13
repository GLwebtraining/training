import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Enums } from '../common/enum.service';

@Component({
  selector: 'tree',
  template: `
  	<div class="level-deep" (mouseover)="level.showMinus = true" (mouseleave)="level.showMinus = false" [ngClass]="['level-'+deepCount]">
	  	<span class="title" (mouseover)="level.showPlus = true" (mouseleave)="level.showPlus = false" [class.deepend]="!level?.children">
	  		<em *ngIf="!!level.children && !!level.children.length" [ngClass]="{'glyphicon-menu-down': level?.children && level.open, 'glyphicon-menu-right': level?.children && !level.open}" (click)="toggleState(level)" class="glyphicon expand" aria-hidden="true"></em>
	  		{{level.name + (level?.description ? ' ' + level?.description : '' )}}
	  		<em *ngIf="level.showPlus && (!!level.children)" (click)="singleClick(level, 'add');" class="glyphicon glyphicon-plus"></em>
	  		<em *ngIf="level.showMinus && !level?.children" (click)="handleRemoveClick(level);" class="glyphicon glyphicon-minus"></em>
	  		<em class="glyphicon glyphicon-pencil"></em>
	  	</span>
		<ul class="tree-component" [hidden]="!level.open" *ngIf="level?.children">
			<li *ngFor="let level of level?.children">
	  			<tree 
	  				[editable]="editable"
	  				[deepCount]="deepCount"
	  				[level]="level" 
	  				[handler]="handleClick" 
	  				[handlerRemove]="handleRemoveClick" 
	  				(toggle)="toggleState($event)"
					(clickRemoveHandler)="handleRemoveClick($event)"
	  				(clickHandler)="handler($event);">
  				</tree>
			</li>
		</ul>
  	</div>
  `,
  styles: [`
  	.level-deep{
  		float: left;
  		clear: both;
  		position: relative;
  	}
  	.level-deep .level-deep {
	    margin: 0 0 0 -13px;
	    padding: 0 0 0 13px;  		
  	}

  	.level-deep ul li:not(:last-child) .level-deep:before{
		content: "";
		position: absolute;
		left: -1px;
		top: 20px;
		width: 1px;
		height: 100%;
		border-left: 1px solid #c5dceb;
  	}
	.level-deep ul{
		margin: 0;
		padding: 0 0 0 30px;
		list-style: none;
		position: relative;
	}
	.level-deep span,
	.level-deep ul li{
		cursor: pointer;
		position: relative;
		padding: 0 0 0 5px;
		line-height: 20px;
	}
	.level-deep span.title{
		border: 1px solid #8EBBD9;
		border-radius: 20px;
		padding: 8px 8px 8px 14px;
		margin-bottom: 5px;
		float: left;
		clear: both;
		position: relative;
		background: #fff;
	}

	.level-deep ul li:first-child li li li span.title:before,
	.level-deep ul li:first-child li li span.title:before,
	.level-deep ul li:first-child li span.title:before,
	.level-deep span.title:before{
		content: "";
		position: absolute;
		left: -15px;
		top: -25px;
		width: 15px;
		height: 44px;
		background: url("data:image/svg+xml;utf8,${Enums.App.icons.corner}") no-repeat;
	}
	.level-deep ul li:first-child li:first-child li:first-child li:first-child span.title:before,
	.level-deep ul li:first-child li:first-child li:first-child span.title:before,
	.level-deep ul li:first-child li:first-child span.title:before,
	.level-deep ul li:first-child span.title:before{
		height: 26px;
		top: -7px;
		background: url("data:image/svg+xml;utf8,${Enums.App.icons.cornerSmall}") no-repeat;
	}

	.level-deep span.title.deepend{
		padding-right: 14px;
	}
	.level-deep span.title.deepend:hover{
		padding-right: 8px;
	}

	.level-deep span.title.deepend em.glyphicon{}

	.level-deep span.title em.glyphicon:hover{
		opacity: 1;
	}
	.level-deep span.title em.glyphicon.glyphicon-pencil{
		border: 0;
	    margin: -10px -10px -10px 0;
	}
	.level-deep span.title em.glyphicon{
	    padding: 0 0 0 7px;
	    float: right;
	    border: 1px dashed #000;
	    border-radius: 19px;
	    padding: 5px;
	    width: 38px;
	    height: 38px;
	    display: block;
	    line-height: 22px;
	    margin: -10px -10px -10px 10px;
	    text-align: center;
	    opacity: 0.7;
	}
	.level-deep span.title em.glyphicon.expand{
		float: left;
		margin: -10px 10px -10px -14px;
	}
	.level-deep span.title em.glyphicon:before{
		font-size: 10px;
	}
  `]
})
export class TreeComponent implements OnInit {
	@Input() level;
	@Input() handler;
	@Input() handlerRemove;
	@Input() deepCount;
	@Input() handlerFirst;
	@Input() editable;
	@Output() clickRemoveHandler: EventEmitter<any> = new EventEmitter();
	@Output() clickHandler: EventEmitter<any> = new EventEmitter();
	@Output() toggle: EventEmitter<any> = new EventEmitter();

	clicked: Boolean = false;

	ngOnInit(): void {}

	handleClick(level): void {
		if (this.editable) {
			if (!this.clicked) {
				this.clicked = true;
				this.toggleState(level, true)
				this.clickHandler.emit(level);
			}
		}
	}

	handleRemoveClick(level): void {
		if (this.editable) {
			this.clickRemoveHandler.emit(level);
		}
	}

	singleClick(level, action): void {
		if (this.editable){
			if (action === 'add'){
				if (this.handlerFirst) { 
					this.handlerFirst(level);
				} else {
					this.handleClick(level);
				}
			} else if (action === 'remove') {
				this.handleRemoveClick(level);
			}

			this.clicked = false;
		}
	}

	toggleState(level, flag): void {
		if (!!level && typeof level === 'object') {
			level.open = flag !== null && flag !== undefined ? flag : !level.open;
			this.toggle.emit(level.open);
		}
	}
}
