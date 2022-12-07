import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';
import { BonificacionesEntity } from '../+state/bonificaciones.models';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root',
})
export class BonificacionesService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/notas`;
  }

  list(
    periodo: Periodo,
    cartera = 'CRE',
    tipo: 'BONIFICACION' | 'DEVOLUCION' | null = null,
    max = 50
  ): Observable<BonificacionesEntity[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera)
      .set('tipo', tipo)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<BonificacionesEntity[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<BonificacionesEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<BonificacionesEntity>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    bonificacion: Partial<BonificacionesEntity>
  ): Observable<BonificacionesEntity> {
    return this.http
      .post<BonificacionesEntity>(this.apiUrl, bonificacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(
    update: Update<BonificacionesEntity>
  ): Observable<BonificacionesEntity> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<BonificacionesEntity>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  timbrar(bonificacion: Partial<BonificacionesEntity>) {
    const url = `${this.apiUrl}/timbrar/${bonificacion.id}`;
    return this.http
      .put<BonificacionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  timbrarV4(bonificacion: Partial<NotaDeCredito>) {
    const url = `${this.apiUrl}/timbrarV4/${bonificacion.id}`;
    console.log('Timbrando desde bonificacion desde el service');
     return this.http
      .put<NotaDeCredito>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(bonificacion: Partial<BonificacionesEntity>) {
    const url = `${this.apiUrl}/aplicar/${bonificacion.id}`;
    return this.http
      .put<BonificacionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
  solicitarAutorizacion(bonificacion: Partial<BonificacionesEntity>) {
    const url = `${this.apiUrl}/solicitarAutorizacion/${bonificacion.id}`;
    return this.http
      .put<BonificacionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelar(bonificacion: Partial<BonificacionesEntity>, motivo: string) {
    const url = `${this.apiUrl}/cancelar/${bonificacion.id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http.put<BonificacionesEntity>(url, {}, { params }).pipe(
      delay(2000),
      catchError((error: any) => throwError(error))
    );
  }

  delete(bonificacion: Partial<BonificacionesEntity>) {
    const url = `${this.apiUrl}/${bonificacion.id}`;
    return this.http
      .delete<BonificacionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
