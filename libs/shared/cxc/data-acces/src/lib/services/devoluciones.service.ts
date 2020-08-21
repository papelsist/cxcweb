import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root',
})
export class DevolucionesService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/notas`;
  }

  list(
    periodo: Periodo,
    cartera: string,
    max = 100
  ): Observable<NotaDeCredito[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera)
      .set('tipo', 'DEVOLUCION')
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<NotaDeCredito[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<NotaDeCredito> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<NotaDeCredito>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(bonificacion: Partial<NotaDeCredito>): Observable<NotaDeCredito> {
    return this.http
      .post<NotaDeCredito>(this.apiUrl, bonificacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<NotaDeCredito>): Observable<NotaDeCredito> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<NotaDeCredito>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  timbrar(bonificacion: Partial<NotaDeCredito>) {
    const url = `${this.apiUrl}/timbrar/${bonificacion.id}`;
    return this.http
      .put<NotaDeCredito>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicar(bonificacion: Partial<NotaDeCredito>) {
    const url = `${this.apiUrl}/aplicar/${bonificacion.id}`;
    return this.http
      .put<NotaDeCredito>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelar(bonificacion: Partial<NotaDeCredito>, motivo: string) {
    const url = `${this.apiUrl}/cancelar/${bonificacion.id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http.put<NotaDeCredito>(url, {}, { params }).pipe(
      delay(2000),
      catchError((error: any) => throwError(error))
    );
  }

  delete(bonificacion: Partial<NotaDeCredito>) {
    const url = `${this.apiUrl}/${bonificacion.id}`;
    return this.http
      .delete<NotaDeCredito>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }
}
