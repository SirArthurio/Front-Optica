
import { Component } from '@angular/core';
import {  IonicModule} from '@ionic/angular';
import {register} from 'swiper/element/bundle';
import { NavbarComponent } from './components/navbar/navbar.component';


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [ IonicModule,NavbarComponent],
})
export class AppComponent {
 

  ngOnInit() {
    
    
  }
}
