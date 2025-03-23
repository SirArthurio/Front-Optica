import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from './BaseApi';
import { perfil } from '../models/Perfil';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API = environment.API_URL;
  private perfilSubject = new BehaviorSubject<perfil | null>(null);
  perfil$ = this.perfilSubject.asObservable();

  constructor(private http: HttpClient) {}

  public perfil(cedula:string): void {
    this.http
      .get<perfil>(`${this.API}/users/getUser/${cedula}`)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => this.perfilSubject.next(data),
        error: (error) => console.log('hay un error:', error),
      });
  }
  private handleError(error: any): Observable<never> {
    console.error('Error en API:', error);
    return throwError(() => new Error('Error al comunicarse con la API'));
  }
}
