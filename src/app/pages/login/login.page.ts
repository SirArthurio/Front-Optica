import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/API/login.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/Context/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  FormLogin: FormGroup;
  private loginService = inject(LoginService);
  private ruta = inject(Router);
  private form = inject(FormBuilder);

  constructor(private auth:AuthService) {
    this.FormLogin = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async login() {
    try {
      const res = await firstValueFrom(this.loginService.Login(this.FormLogin.value));
      console.log('Token recibido:', res.token);
      localStorage.setItem('cedula',res.cedula);
      localStorage.setItem('id',res.id);
      this.auth.setToken(res.token)
      this.ruta.navigate(['/inicio']); 
    } catch (error) {
      console.error('Error en login:', error);
    }
  }

  async onsubmit() {
    if (this.FormLogin.valid) {
      console.log('Formulario enviado:', this.FormLogin.value);
      await this.login();
    } else {
      console.warn('Formulario inválido');
    }
  }
}
