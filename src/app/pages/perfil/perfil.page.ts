import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/API/user.service';
import { perfil } from 'src/app/models/Perfil';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class PerfilPage implements OnInit {
  Perfil:perfil|null=null;
  cedula:string='';
  cedulaLocal=localStorage.getItem("cedula")
 
  constructor(private user: UserService) {}

  ngOnInit() {
    if(typeof this.cedulaLocal==="string"){
      this.cedula=this.cedulaLocal
    }
    this.user.perfil$.subscribe({
      next:(data)=>this.Perfil=data,
      error:(error)=>console.log("error:",error)
    });
    this.user.perfil(this.cedula)
    console.log(this.Perfil?.cedula,this.Perfil?.direccion)
  }
}
