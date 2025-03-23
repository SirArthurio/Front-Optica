import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
  standalone: true,
  imports: [ IonicModule,CommonModule, FormsModule,NgIf,NgFor,RouterLink]
})
export class AdministrarPage implements OnInit {
  cards=[
    {
      nombre:"Productos", url:"productos-crud",rol:"ADMINISTRADOR",img:"https://www.sura-am.com/sites/default/files/2024-05/C%C3%B3mo%20administrar%20y%20utilizar%20mi%20dinero%20correctamente.jpeg"
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
