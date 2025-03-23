import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { productos } from 'src/app/API/producto';
import { ProductosService } from 'src/app/API/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class ProductosPage implements OnInit {
  FormFiltro: FormGroup;
  valorFiltro: string = 'todos'; 
  filteredProducts: productos[] = [];
  data$: Observable<productos[]> = of([]);
  categorias: string[] = []; 
  private productosService = inject(ProductosService);

  constructor(private formBuilder: FormBuilder) {
    this.FormFiltro = this.formBuilder.group({
      filtro: ['todos', Validators.required] 
    });
  }

  ngOnInit() {
    this.data$ = this.productosService.Productos();
  
    this.data$.subscribe(data => {
      this.filteredProducts = data;
      this.categorias = this.obtenerCategorias(data); 
    });
  
    this.FormFiltro.get('filtro')?.valueChanges.subscribe(value => {
      this.valorFiltro = value;
      this.filtrarProductos();
    });
  }
  
  obtenerCategorias(productos: productos[]): string[] {
    return [...new Set(productos.map(p => p.categoria))];
  }
  
  filtrarProductos() {
    this.data$.subscribe(data => {
      if (this.valorFiltro === 'todos') {
        this.filteredProducts = data;
      } else {
        this.filteredProducts = data.filter(item => item.categoria === this.valorFiltro);
      }
    });
  }
}
