import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inf-refraccion',
  templateUrl: './inf-refraccion.page.html',
  styleUrls: ['./inf-refraccion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterLink]
})
export class InfRefraccionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
