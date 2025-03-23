import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuDerechoComponent } from '../menu-derecho/menu-derecho.component';
import { MenuIzquierdoComponent } from '../menu-izquierdo/menu-izquierdo.component';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { AuthService } from 'src/app/Context/auth.service';
import { CarritoService } from 'src/app/API/carrito.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger("badgeAnimation", [
      transition(":enter", [
        style({ transform: "scale(0)" }),
        animate("200ms ease-out", style({ transform: "scale(1)" })),
      ]),
      transition(":increment", [
        style({ transform: "scale(1.5)" }),
        animate("200ms ease-out", style({ transform: "scale(1)" })),
      ]),
    ]),
    trigger("searchAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("200ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))]),
    ]),
  ],
  imports: [IonicModule, MenuDerechoComponent, MenuIzquierdoComponent, NgIf, RouterLink]
})
export class NavbarComponent implements OnInit, OnDestroy {
  mensajeRecibido: string = ''; 
  title: string = '';
  isLogin: boolean = false;
  isAuthenticate: boolean = false;
  cantidadCarrito: number = 0;
  showSearch = false;
  rolUser: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private carritoService: CarritoService, 
    private auth: AuthService
  ) {}

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  ngOnInit() {
    this.obtenerRol();
    
    this.subscriptions.add(
      this.carritoService.carritoCantidad$.subscribe(cantidad => {
        this.cantidadCarrito = cantidad;
      })
    );

    this.obtenerCarrito();
    
    this.subscriptions.add(
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => {
            let route = this.activatedRoute;
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          }),
          map(route => route.snapshot.data['title'])
        )
        .subscribe(title => {
          this.title = title || 'Título predeterminado';
          this.isLogin = this.title.toLowerCase() === 'login';
        })
    );
  }

  obtenerCarrito() {
    const userId = localStorage.getItem('id') ?? '';
    this.carritoService.actualizarCarritoCantidad(userId);
  }

  obtenerRol() {
    this.subscriptions.add(
      this.auth.authState$.subscribe(logueado => {
        this.isAuthenticate = logueado;
        console.log("Estado de autenticación:", this.isAuthenticate);
        
        if (this.isAuthenticate) {
          this.subscriptions.add(
            this.auth.rol$.subscribe(rol => {
              this.rolUser = rol;
              console.log("Rol actualizado:", this.rolUser);
            })
          );
        } else {
          this.rolUser = null;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
