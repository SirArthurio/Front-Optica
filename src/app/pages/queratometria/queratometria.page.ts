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
  horizontal,
  vertical,
  sucursales,
} from 'src/app/components/valoresExamenes';

@Component({
  selector: 'app-queratometria',
  templateUrl: './queratometria.page.html',
  styleUrls: ['./queratometria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class QueratometriaPage implements OnInit {
  ExamenQueratometria: FormGroup;
  private form = inject(FormBuilder);
  ejeOjo = eje;
  horizontalOjo = horizontal;
  verticalOjo = vertical;
  surcurzal = sucursales;
  constructor() {
    this.ExamenQueratometria = this.form.group({
      comentario: ['', Validators.required],
      surcurzal: ['', Validators.required],
      ejeOjoDerecho: ['', Validators.required],
      ejeOjoIzquierdo: ['', Validators.required],
      verticalOjoDerecho: ['', Validators.required],
      verticalOjoIzquierdo: ['', Validators.required],
      horizontalOjoDerecho: ['', Validators.required],
      horizontalOjoIzquierdo: ['', Validators.required],
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
    if (this.ExamenQueratometria.valid) {
      console.log(this.ExamenQueratometria.value);
      this.ExamenQueratometria.reset();
    } else {
      console.log('error', this.ExamenQueratometria.errors);
    }
  }

  ngOnInit() {}
}
