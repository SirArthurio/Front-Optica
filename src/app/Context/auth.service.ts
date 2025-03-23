import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token') || null);
  private authState = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private rolSubject=new BehaviorSubject<string |null>(this.getUserRole())
  token$ = this.tokenSubject.asObservable();
  authState$ = this.authState.asObservable();
  rol$=this.rolSubject.asObservable()

  constructor() {
    this.updateUserRole();

  }

  setToken(token: string): void {
    if (!token) {
      console.error("Intento de establecer un token vacío.");
      return;
    }
    this.tokenSubject.next(token);
    this.authState.next(true);
    localStorage.setItem("token", token);
    this.updateUserRole();
  }
  private updateUserRole(): void {
    const role = this.getUserRole();
    this.rolSubject.next(role);
  }
  getToken(): string | null {
    return this.tokenSubject.value; 
  }

 

  isAuthenticated(): boolean {
    return this.authState.value;
  }

  getAuthState() {
    return this.authState$;
  }
  removeToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("cedula");
    this.tokenSubject.next(null);
    this.authState.next(false);
    this.rolSubject.next(null);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      console.log("Payload decodificado:", payload);

      if (typeof payload.rol !== "string") {
        console.error("El campo 'rol' no es un string válido.");
        return null;
      }

      const rolesArray: string[] = payload.rol.replace(/\[|\]/g, '')
        .split(',')
        .map((r: string) => r.trim());

      console.log("Roles procesados:", rolesArray);
      const roleItem = rolesArray.find((r: string) => r.startsWith("ROL:"));

      return roleItem ? roleItem.split(":")[1] : null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
}
