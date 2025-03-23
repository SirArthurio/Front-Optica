import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/Context/auth.service';
import { MenuItem } from '../MenuItems';

@Component({
  selector: 'app-menu-derecho',
  templateUrl: './menu-derecho.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      ion-menu.profile-menu::part(backdrop) {
        background-color: rgba(0, 0, 0, 0.5);
      }

      ion-menu.profile-menu::part(container) {
        border-radius: 20px 0 0 20px;
        box-shadow: -4px 0px 16px rgba(0, 0, 0, 0.1);
        max-width: 320px;
      }

      .menu-item-active {
        background-color: #e6fffa;
        color: #0d9488;
        font-weight: 600;
      }

      .menu-item-active ion-icon {
        color: #0d9488;
      }

      ion-list {
        background: transparent;
      }

      ion-item {
        --background: transparent;
      }

      .logout-button {
        --border-radius: 10px;
        --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    `,
  ],
  imports: [IonicModule, RouterLink, NgFor, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MenuDerechoComponent implements OnChanges {
  @Input() rol: string | null = null;

  public usuario: string | null = '';

  public perfilItems = [
    {
      title: 'Perfil',
      url: 'perfil',
      icon: 'accessibility-outline',
      roles: ['PACIENTE', 'OPTOMETRA', 'ADMINISTRADOR'],
    },
    {
      title: 'Realizar Examen',
      url: 'examenes',
      icon: 'paper-plane',
      roles: ['OPTOMETRA', 'ADMINISTRADOR',null],
    },
    {
      title: 'Resultados Examenes',
      url: 'resultados',
      icon: 'document-text-outline',
      roles: ['PACIENTE', 'OPTOMETRA', 'ADMINISTRADOR'],
    },
    {
      title: 'Administrar',
      url: 'administrar',
      icon: 'document-text-outline',
      roles: ['ADMINISTRADOR', 'OPTOMETRA',null],
    },
  ];
  constructor(private ruta: Router, private auth: AuthService) {}
  menuFiltrado: MenuItem[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rol']) {
      this.filtrarMenu();
    }
  }

  filtrarMenu() {
    this.menuFiltrado = this.perfilItems.filter((item) =>
      item.roles.includes(this.rol)
    );
  }
  logout() {
    console.log('cerrando');
    this.auth.removeToken();
    this.auth.isAuthenticated();
    this.ruta.navigate(['/login']);
  }
}
