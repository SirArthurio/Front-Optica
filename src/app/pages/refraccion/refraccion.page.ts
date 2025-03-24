import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  eje,
  esfera,
  cilindro,
  adicion,
  dnp,
  agudezaSc,
  agudezaCc,
  sucursales,
} from 'src/app/components/valoresExamenes';
import { MenuController } from '@ionic/angular'; 


@Component({
  selector: 'app-refraccion',
  templateUrl: './refraccion.page.html',
  styleUrls: ['./refraccion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule],
})
export class RefraccionPage implements OnInit {
  public sucursales = sucursales;
  public esfera = esfera;
  public cilindro = cilindro;
  public eje = eje;
  public adicion = adicion;
  public dnp = dnp;
  public agudezaSc = agudezaSc;
  public agudezaCc = agudezaCc;
  public surcurzaless = sucursales;

  ExamenRefraccion: FormGroup;
  private form = inject(FormBuilder);
  constructor(private menu: MenuController) {
    this.ExamenRefraccion = this.form.group({
      esferaOjoDerecho: ['', Validators.required],
      esferaOjoIzquierdo: ['', Validators.required],
      cilindroOjoDerecho: ['', Validators.required],
      cilindroOjoIzquierdo: ['', Validators.required],
      ejeOjoDerecho: ['', Validators.required],
      ejeOjoIzquierdo: ['', Validators.required],
      adiccionOjoDerecho: ['', Validators.required],
      adiccionOjoIzquierdo: ['', Validators.required],
      dnpOjoDerecho: ['', Validators.required],
      dnpOjoIzquierdo: ['', Validators.required],
      agudezaVisualScOjoDerecho: ['', Validators.required],
      agudezaVisualScOjoIzquierdo: ['', Validators.required],
      agudezaVisualCcOjoDerecho: ['', Validators.required],
      agudezaVisualCcOjoIzquierdo: ['', Validators.required],
      observaciones: ['', Validators.required],
    });
  }
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.onSubmit();
      },
    },
  ];
  onSubmit() {
    if (this.ExamenRefraccion.valid) {
      console.log(this.ExamenRefraccion.value);
      this.ExamenRefraccion.reset();
    } else {
      console.log('error', this.ExamenRefraccion.errors);
    }
  }
  

  ngOnInit() {}
}
