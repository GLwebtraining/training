import { Component } from '@angular/core';
import { Enums } from './common/enum.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  attrs: Object = Enums;
}
