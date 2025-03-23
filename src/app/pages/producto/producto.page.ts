import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { productos } from 'src/app/API/producto';
import { Observable, of } from 'rxjs';
import { ProductosService } from 'src/app/API/productos.service';
import { carrito } from 'src/app/API/carrito';
import { IonicModule } from '@ionic/angular';
import { CarritoService } from 'src/app/API/carrito.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ProductoPage implements OnInit {
  Carrito: carrito[] = [];
  cantidad: number = 0;
  producto: productos | null = null;
  id!: string;
  data$: Observable<productos | null> = of(null);
  private productosService = inject(ProductosService);
  total: number = 0;
  private carritoService = inject(CarritoService);
  constructor(private ruta: ActivatedRoute,private alertController:AlertController ) {}

  ngOnInit() {
    this.ruta.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
      if (this.id) {
        this.productosService.Producto(this.id).subscribe((producto) => {
          if (producto) {
            this.producto = producto;
          }
        });
      }
    });
  }
  incrementar() {
    if (!this.producto) return;
    this.cantidad += 1;
  }
  decrementar() {
    if (!this.producto) return;
    if (this.cantidad > 0) {
      this.cantidad -= 1;
    }
  }
  whatsapp(){
    this.alertController.create({
      header: 'WhatsApp',
      message: '¿Desea comunicarse con nosotros por WhatsApp?',
      
  }).then((alert) => alert.present());
  }

  async agregar(ProductoId: string) {
    if (!this.cantidad || this.cantidad <= 0) {
      console.error('Cantidad inválida');
      return;
    }
  
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('Usuario no autenticado');
      return;
    }
  
    const itemCarrito = {
      userId: userId,
      productoId: { id: ProductoId }, 
      cantidad: this.cantidad,
    };
  
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
            this.carritoService.AddCarrito(itemCarrito,userId).subscribe(
              () => {
                this.presentAlert('Éxito', 'Producto agregado correctamente.'); 
                this.cantidad = 0;
              },
              (error) => console.error('Error al agregar producto al carrito:', error)
            );
          },
        },
      ],
    });
  
    await alert.present(); 
  }
  
 async presentAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK'],
  });
  await alert.present();
}
calcularTotal() {
  if (!this.producto) return 0;
  return this.producto.precio * this.cantidad;
}
 
}
