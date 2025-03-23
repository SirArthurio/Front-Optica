import { Injectable } from '@angular/core';
import { environment } from './BaseApi';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  API = environment.API_URL;
  constructor(private http: HttpClient) {}

  public crearFactura(userId: string): Observable<any> {
    return this.http.post<any>(`${this.API}/factura/crear/${userId}`, {}).pipe(
      catchError((error) => {
        console.log('error:', error);
        return throwError(() => error);
      })
    );
}

}
