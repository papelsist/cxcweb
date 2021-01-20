import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, AnticipoSatDet } from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root',
})
export class AnticiposService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/anticipos/aplicaciones`;
  }

  list(
    periodo: Periodo,
    cartera: string,
    disponibles = false,
    porTimbrar = false,
    max = 500
  ): Observable<AnticipoSatDet[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera === 'CON' ? 'COD' : cartera)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('disponibles', disponibles.toString())
      .set('porTimbrar', porTimbrar.toString())
      .set('rows', max.toString());
    return this.http
      .get<AnticipoSatDet[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<AnticipoSatDet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<AnticipoSatDet>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<AnticipoSatDet>): Observable<AnticipoSatDet> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<AnticipoSatDet>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarCfdi(id: string): Observable<AnticipoSatDet> {
    const url = `${this.apiUrl}/timbrar/${id}`;
    return this.http
      .put<AnticipoSatDet>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarCfdi(id: string, motivo: string): Observable<AnticipoSatDet> {
    const url = `${this.apiUrl}/cancelar/${id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http
      .put<AnticipoSatDet>(url, {}, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
