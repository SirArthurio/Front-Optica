import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './BaseApi';
import { catchError, Observable, observable, throwError } from 'rxjs';
import { Time } from '@angular/common';

interface citas{
  id:string,
  fecha:Date,
  hora:string,
  disponible:boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  API=environment.API_URL;

  constructor(private http:HttpClient) {


   }

   public obtenerFechasDisponibles():Observable<any>{
    return this.http.get<citas>(`${this.API}/citas/fechas-disponibles`).pipe(
      catchError((error)=>{
        console.log(error);
        return throwError(()=>error);
      })
    );
   }
   public obtenerHorariosDisponibles(fecha:any):Observable<any>{
    return this.http.get<citas>(`${this.API}/citas/horarios-disponibles`,fecha).pipe(
      catchError((error)=>{
        console.log(error);
        return throwError(()=>error);
      })
    );
   }

   apartarCita(data:any): Observable<any> {
console.log("llego:",data)
    return this.http.post(`${this.API}/citas/apartar`, data);
  }


}
