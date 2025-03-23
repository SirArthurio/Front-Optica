import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from "@angular/router"
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.page.html',
  styleUrls: ['./unauthorized.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule]
})
export class UnauthorizedPage  {

  constructor(private router: Router) {}

 
  goToLogin(): void {
    this.router.navigate(["/login"])
  }

  goToHome(): void {
    this.router.navigate(["/"])
  }
}
  


