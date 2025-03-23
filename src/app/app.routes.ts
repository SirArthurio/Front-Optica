import { Routes } from '@angular/router';
import { AuthGuard } from './Guard/auth-guard.guard';
import { tick } from '@angular/core/testing';

export const routes: Routes = [
  {
    data: { title: 'Inicio' },
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },

  {
    path: 'inicio',
    data: { title: 'Inicio',roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA"] },
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    data: { title: 'Examenes',roles:["ADMINISTRADOR","OPTOMETRA"] },
    path: 'examenes',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/examenes/examenes.page').then( m => m.ExamenesPage)
  },
  {
    data: { title: 'Examen Queratometria',roles:["ADMINISTRADOR","OPTOMETRA"]  },
    path: 'queratometria',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/queratometria/queratometria.page').then( m => m.QueratometriaPage)
  },
  {
    data: { title: 'Refraccion',roles:["ADMINISTRADOR","OPTOMETRA"]  },
    path: 'refraccion',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/refraccion/refraccion.page').then( m => m.RefraccionPage)
  },
  {
    data: { title: 'login',roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]  },
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    data: {title:'Productos',roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]},
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage)
  },
  {
    data:{title:'Producto',roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]},
    path: 'producto/:id',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/producto/producto.page').then( m => m.ProductoPage)
  },
  {
    data:{title:"ESTAS COMO DAVIVIENDA, EN EL LUGAR INCORRECTO"},
    path: 'unauthorized',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/unauthorized/unauthorized.page').then( m => m.UnauthorizedPage)
  },
  {
    data:{title:"Resultados",roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]},
    path: 'resultados',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/resultados/resultados.page').then( m => m.ResultadosPage)
  },
  {
    data:{title:"Perfil",roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]},
    path: 'perfil',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    data:{title:"Carrito"},
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.page').then( m => m.CarritoPage)
  },
  {
    data:{title:"Productos CRUD",roles:["PACIENTE","ADMINISTRADOR","OPTOMETRA",null]},
    path: 'administrar/productos-crud',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/productos-crud/productos-crud.page').then( m => m.ProductosCRUDPage)
  },
  {
    data:{title:"Administrar",roles:["ADMINISTRADOR","OPTOMETRA"]},
    path: 'administrar',
    canActivate:[AuthGuard],
    loadComponent: () => import('./pages/administrar/administrar.page').then( m => m.AdministrarPage)
  },
  {
    data:{title:"Agendar Cita"},
    path: 'cita',
    loadComponent: () => import('./pages/cita/cita.page').then( m => m.CitaPage)
  },
  {
    data:{title:"Queratometria"},
    path: 'inf-queratometria',
    loadComponent: () => import('./pages/inf-queratometria/inf-queratometria.page').then( m => m.InfQueratometriaPage)
  },
  {
    data:{title:"Refraccion"},
    path: 'inf-refraccion',
    loadComponent: () => import('./pages/inf-refraccion/inf-refraccion.page').then( m => m.InfRefraccionPage)
  },
 
];
