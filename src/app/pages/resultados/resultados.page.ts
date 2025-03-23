import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RefraccionService } from 'src/app/API/refraccion.service';
import { Observable, of } from 'rxjs';
import { Refaccion } from 'src/app/models/Refraccion';
@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule]
})
export class ResultadosPage implements OnInit {
  data$: Observable<Refaccion[]> = of([])
  loading = true

  columns = [
    { key: "cedula", header: "Cédula" },
    { key: "surcurzal", header: "Sucursal" },
    { key: "comentario", header: "Comentario" },
    { key: "ojoderecho", header: "Ojo Derecho" },
    { key: "ojoizquierdo", header: "Ojo Izquierdo" },
  ]

  constructor(private refraccion: RefraccionService) {}

  ngOnInit() {
    this.loading = true
    this.data$ = this.refraccion.Resultados()
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  formatOjo(ojo: any): string {
    if (!ojo) return "Sin datos"
    return `
      Esfera: ${ojo.esfera ?? "-"} | 
      Cilindro: ${ojo.cilindro ?? "-"} | 
      Eje: ${ojo.eje ?? "-"} | 
      ADD: ${ojo.add ?? "-"} | 
      DNP: ${ojo.dnp ?? "-"} | 
      AV SC: ${ojo.agudeza_visual_sc ?? "-"} | 
      AV CC: ${ojo.agudeza_visual_cc ?? "-"}
    `
  }

  getValue(row: any, key: string): any {
    if (key === "ojoderecho") return this.formatOjo(row.ojoderecho)
    if (key === "ojoizquierdo") return this.formatOjo(row.ojoizquierdo)
    return row[key]
  }
}
