import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { productos } from './producto';
import { environment } from './BaseApi';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  API = environment.API_URL;
  constructor(private http: HttpClient) {}

  public Productos(): Observable<productos[]> {
    return this.http.get<productos[]>(`${this.API}/productos/getAllProductos`).pipe(
      catchError((error) => {
        console.log('error:', error);
        return throwError(() => error);
      })
    );
  }
  public Producto(id: string): Observable<productos> {
    return this.http
      .get<productos>(`${this.API}/productos/getPruducto/${id}`)
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public crearProducto(data: productos): Observable<productos> {
    return this.http
      .post<productos>(`${this.API}/productos/addProducto`, data)
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public actualizarProducto(data: productos): Observable<productos> {
    return this.http
      .put<productos>(`${this.API}/productos/editProducto/${data.id}`, data)
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public eliminarProducto(id: string): Observable<productos> {
    return this.http
      .delete<productos>(`${this.API}/productos/deleteProducto/${id}`)
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
}
