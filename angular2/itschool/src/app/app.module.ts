import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { Storage } from './Common/storage.service';
import { CoursesService } from './Common/courses.service';
import { StudentsService } from './Common/students.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Storage, CoursesService, StudentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
