
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink,  } from '@angular/router';
import {  IonicModule} from '@ionic/angular';
import {register} from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink,NgFor, IonicModule,RouterLink],
})
export class AppComponent {
  public menuItems = [
    { title: 'Examenes', url: 'examenes', icon: 'mail' },
    { title: 'Inicio', url: 'inicio', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
  }
}
