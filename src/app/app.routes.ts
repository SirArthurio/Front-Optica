import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },

  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'examenes',
    loadComponent: () => import('./pages/examenes/examenes.page').then( m => m.ExamenesPage)
  },
  {
    path: 'queratometria',
    loadComponent: () => import('./pages/queratometria/queratometria.page').then( m => m.QueratometriaPage)
  },
  {
    path: 'refraccion',
    loadComponent: () => import('./pages/refraccion/refraccion.page').then( m => m.RefraccionPage)
  },
];
