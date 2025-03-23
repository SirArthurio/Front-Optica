import { Injectable } from '@angular/core';
import { environment } from './BaseApi';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { carrito } from './carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  API = environment.API_URL;
  private carritoCantidad = new BehaviorSubject<number>(0);
  public carritoCantidad$ = this.carritoCantidad.asObservable();

  constructor(private http: HttpClient) {}

  actualizarCantidad(carritoId: string, nuevaCantidad: number, userId: string): Observable<any> {
    return this.http.put(`${this.API}/carrito/${carritoId}/cantidad/${nuevaCantidad}`, {}).pipe(
      tap(() => this.actualizarCarritoCantidad(userId)), 
      catchError(error => {
        console.error('Error en actualizarCantidad:', error);
        return throwError(() => error);
      })
    );
  }

  public ObtenerCarrito(userId: string): Observable<carrito[]> {
    return this.http.get<carrito[]>(`${this.API}/carrito/${userId}`).pipe(
      tap(response => console.log("respuesta", response)),
      catchError(error => {
        console.log('error:', error);
        return throwError(() => error);
      })
    );
  }

  public AddCarrito(data: any, userId: string): Observable<any> {
    return this.http.post<any>(`${this.API}/carrito/addCarrito`, data).pipe(
      tap(() => this.actualizarCarritoCantidad(userId)), 
      catchError(error => {
        console.log('error:', error);
        return throwError(() => error);
      })
    );
  }

  public eliminarDelCarrito(id: string, userId: string): Observable<carrito> {
    return this.http.delete<carrito>(`${this.API}/carrito/eliminarCarrito/${id}`).pipe(
      tap(() => this.actualizarCarritoCantidad(userId)),
      catchError(error => {
        console.log('error:', error);
        return throwError(() => error);
      })
    );
  }


  actualizarCarritoCantidad(userId: string) {
    this.ObtenerCarrito(userId).subscribe((carrito) => {
      const cantidadTotal = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
      this.carritoCantidad.next(cantidadTotal); 
    });
  }

}
