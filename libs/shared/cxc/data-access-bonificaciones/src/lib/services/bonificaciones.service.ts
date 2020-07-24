import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';
import { BonificacionesEntity } from '../+state/bonificaciones.models';

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

  save(
    bonificacion: Partial<BonificacionesEntity>
  ): Observable<BonificacionesEntity> {
    return this.http
      .post<BonificacionesEntity>(this.apiUrl, bonificacion)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<BonificacionesEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<BonificacionesEntity>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
