import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService } from 'src/app/API/productos.service';
import { AlertController } from '@ionic/angular';
import{IonicModule} from '@ionic/angular';
import { Valores } from 'src/app/API/producto';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-productos-crud',
  templateUrl: './productos-crud.page.html',
  styles: [
    `
    ion-item {
      --background: transparent;
      --border-color: transparent;
    }
    
    ion-button {
      --border-radius: 10px;
    }
    
    ion-card {
      margin: 0;
    }
    
    ion-select::part(icon) {
      color: var(--ion-color-primary);
    }
  `,
  ],
  standalone: true,
  animations: [
    trigger("itemAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
  imports: [ CommonModule, FormsModule,IonicModule,ReactiveFormsModule,NgFor,NgIf]
})
export class ProductosCRUDPage implements OnInit {
  categoria=Valores;
  productoForm: FormGroup;
  productos: any[] = [];
  private productoService = inject(ProductosService);
  private alertController = inject(AlertController);
  
  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(1)]],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
    });
  }
  
  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.Productos().subscribe(
      (data) => (this.productos = data),
      (error) => console.error('Error al obtener los productos:', error)
    );
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.presentAlert('Error', 'Por favor llena todos los campos correctamente.');
      return;
    }
  
    const producto = this.productoForm.value;
  
    if (producto.id) {
      this.productoService.actualizarProducto(producto).subscribe(
        () => {
          this.presentAlert('Éxito', 'Producto actualizado correctamente.');
          this.obtenerProductos();
          this.productoForm.reset();  
        },
        (error) => console.error('Error al actualizar el producto:', error)
      );
    } else {
      this.productoService.crearProducto(producto).subscribe(
        () => {
          this.presentAlert('Éxito', 'Producto creado correctamente.');
          this.obtenerProductos();
          this.productoForm.reset(); 
        },
        (error) => console.error('Error al crear el producto:', error)
      );
    }
  }
  

  editarProducto(producto: any) {
    this.productoForm.patchValue({
      id: producto.id, 
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      categoria: producto.categoria
    });
  }
  

  eliminarProducto(id: string) {
    this.productoService.eliminarProducto(id).subscribe(
      () => {
        this.presentAlert('Éxito', 'Producto eliminado correctamente.');
        this.obtenerProductos();
      },
      (error) => console.error('Error al eliminar el producto:', error)
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
