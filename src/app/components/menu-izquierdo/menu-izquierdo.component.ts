import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuItem } from '../MenuItems';


@Component({
  selector: 'app-menu-izquierdo',
  templateUrl: './menu-izquierdo.component.html',
  styleUrls: ['./menu-izquierdo.component.scss'],
  imports: [IonicModule, RouterLink, NgFor]
})
export class MenuIzquierdoComponent implements OnChanges {
  @Input() rol: string | null = null;
  
  public menuItems: MenuItem[] = [
    { title: 'Realizar Examen', url: 'examenes', icon: 'mail', roles: ["OPTOMETRA", "ADMINISTRADOR"] },
    { title: 'Inicio', url: 'inicio', icon: 'paper-plane', roles: ["OPTOMETRA", "ADMINISTRADOR", "PACIENTE", null] },
    { title: 'Productos', url: 'productos', icon: 'paper-plane', roles: ["OPTOMETRA", "ADMINISTRADOR", "PACIENTE", null] },
  ];

  menuFiltrado: MenuItem[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rol']) {
      this.filtrarMenu();
    }
  }

  filtrarMenu() {
    this.menuFiltrado = this.menuItems.filter(item => item.roles.includes(this.rol));
  }
}
