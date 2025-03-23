import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import { catchError } from 'rxjs';
import { environment } from './BaseApi';
import { AuthService } from '../Context/auth.service';

export interface LoginData {
  usuario: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private API=environment.API_URL;
 private auth = new AuthService
  
  constructor(private http: HttpClient) {}

  public Login(datos: LoginData): Observable<any> {
    console.log("DAtos",datos)
    return this.http.post<any>(`${this.API}/auth/login`, datos).pipe(
      catchError(error => {
        console.error('Error en la autenticación:', error,"datos:",datos);
        return throwError(() => error);
      })
    );
  }
  public Logout():any{
    this.auth.removeToken()
    return console.log("se cerro la sesion");
  }
}
