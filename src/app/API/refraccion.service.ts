import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from './BaseApi';
import { Refaccion } from '../models/Refraccion';
@Injectable({
  providedIn: 'root'
})
export class RefraccionService {
  API=environment.API_URL;
  constructor(private http:HttpClient) { }

  public Resultados():Observable<Refaccion[]>{
    return this.http.get<Refaccion[]>(`${this.API}/examen/refraccion`).pipe(catchError(error=>{
      console.log("error:",error);
      return throwError(()=>error);
    }))
  }
  public Resultado(cedula:string):Observable<Refaccion>{
    return this.http.get<Refaccion>(`${this.API}/examen/refraccion/${cedula}`).pipe(catchError(error=>{
      console.log("error:",error);
      return throwError(()=>error);
    }))
  }
}
