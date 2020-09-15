import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';
import { DevolucionesEntity } from '../+state/devoluciones.models';
import { Update } from '@ngrx/entity';

@Injectable()
export class Devoluciones2Service {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/notas`;
  }

  list(
    periodo: Periodo,
    cartera: string,
    max = 100
  ): Observable<DevolucionesEntity[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera)
      .set('tipo', 'DEVOLUCION')
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<DevolucionesEntity[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<DevolucionesEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<DevolucionesEntity>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(
    bonificacion: Partial<DevolucionesEntity>
  ): Observable<DevolucionesEntity> {
    return this.http
      .post<DevolucionesEntity>(this.apiUrl, bonificacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<DevolucionesEntity>): Observable<DevolucionesEntity> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<DevolucionesEntity>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  timbrar(bonificacion: Partial<DevolucionesEntity>) {
    const url = `${this.apiUrl}/timbrar/${bonificacion.id}`;
    return this.http
      .put<DevolucionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(bonificacion: Partial<DevolucionesEntity>) {
    const url = `${this.apiUrl}/aplicar/${bonificacion.id}`;
    return this.http
      .put<DevolucionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelar(bonificacion: Partial<DevolucionesEntity>, motivo: string) {
    const url = `${this.apiUrl}/cancelar/${bonificacion.id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http.put<DevolucionesEntity>(url, {}, { params }).pipe(
      delay(2000),
      catchError((error: any) => throwError(error))
    );
  }

  delete(bonificacion: Partial<DevolucionesEntity>) {
    const url = `${this.apiUrl}/${bonificacion.id}`;
    return this.http
      .delete<DevolucionesEntity>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
