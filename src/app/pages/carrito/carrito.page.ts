import { Component, inject,EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { IonicModule } from '@ionic/angular';
import { carrito } from 'src/app/API/carrito';
import { CarritoService } from 'src/app/API/carrito.service';
import { AlertController } from '@ionic/angular';
import { FacturaService } from 'src/app/API/factura.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styles: [
    `
    :host {
      display: block;
    }
    
    ion-content::part(scroll) {
      display: flex;
      flex-direction: column;
    }
  `,
  ],
  animations: [
    trigger("itemAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("200ms ease-in", style({ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, IonicModule,RouterLink],
})
export class CarritoPage implements OnInit {
  @Output() mensajeAlPadre = new EventEmitter<number>(); 

  userId: string = localStorage.getItem('id')!;
  carrito: carrito[] = [];
  private carritoService = inject(CarritoService);
  private facturaService=inject(FacturaService);
  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    this.carritoService.ObtenerCarrito(this.userId).subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.carrito = Array.isArray(data) ? data : [];
      },
      (error) => {
        console.error('Error al obtener el carrito:', error);
        if (error.status === 404) {
          this.carrito = []; 
        }
      }
    );
  }
  

  calcularTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + item.cantidad * item.productoId.precio,
      0
    );
  }
  async presentAlert(
    header: string,
    subHeader?: string,
    message?: string,
    buttonText: string = 'OK'
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [buttonText],
    });

    await alert.present();
  }

  async eliminarProducto(id: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: '¿Estás seguro de que quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.carritoService.eliminarDelCarrito(id,this.userId).subscribe(
              () => {
                this.carrito = this.carrito.filter((item) => item.id !== id);
                this.presentAlert('Producto eliminado', 'El producto se ha eliminado del carrito.');
              },
              (error) => {
                console.error('Error al eliminar el producto:', error);
                this.presentAlert('Error', 'No se pudo eliminar el producto.');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
  modificarCantidad(id: string, cantidad: number) {
    const producto = this.carrito.find(item => item.id === id);
    if (!producto) return;

    const nuevaCantidad = producto.cantidad + cantidad;
    if (nuevaCantidad <= 0) return;

    this.carritoService.actualizarCantidad(id, nuevaCantidad,this.userId).subscribe(
      (response: any) => {
        if (response && response.mensaje && response.mensaje.includes('No se encontró')) {

          this.presentAlert('Error', 'El producto no se encontró en el carrito.');
          return;
        }
        producto.cantidad = nuevaCantidad;
        this.mensajeAlPadre.emit(cantidad)
      },
      (error) => {
        if (error.status === 404) {
          this.presentAlert('Error', 'No se encontró el producto en el carrito.');
        } else {
          console.error('Error al actualizar la cantidad:', error);
          this.presentAlert('Error', 'No se pudo actualizar la cantidad del producto.');
        }
      }
    );
  }
  async pagar() {
    const alert = await this.alertController.create({
      header: 'Confirmación de Pago',
      message: `Estás a punto de procesar el pago de $${this.calcularTotal()}. ¿Deseas continuar?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, pagar',
          handler: () => {
            this.facturaService.crearFactura(this.userId).subscribe(
              () => {
                this.obtenerCarrito(); 
                this.presentAlert('Pago realizado', 'Tu pago se ha procesado exitosamente.');
              },
              (error:any) => {
                console.error('Error en el pago:', error,this.userId);
                this.presentAlert('Error', 'Ocurrió un problema al procesar tu pago.');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
