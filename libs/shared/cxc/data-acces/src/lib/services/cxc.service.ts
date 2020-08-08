import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Periodo,
  CuentaPorCobrarDTO,
  CuentaPorCobrar,
  Cartera,
} from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CxcService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cuentasPorCobrar`;
  }

  list(
    periodo: Periodo,
    cartera: Cartera,
    max = 50
  ): Observable<CuentaPorCobrarDTO[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera.clave)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<CuentaPorCobrarDTO[]>(this.apiUrl, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  facturas(
    periodo: Periodo,
    cartera: Cartera,
    max = 50
  ): Observable<CuentaPorCobrarDTO[]> {
    const url = `${this.apiUrl}/facturas`;
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera.clave)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<CuentaPorCobrarDTO[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  facturasPendientes(clienteId: string): Observable<CuentaPorCobrarDTO[]> {
    const url = `${this.apiUrl}/pendientes/${clienteId}`;
    return this.http
      .get<CuentaPorCobrarDTO[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<CuentaPorCobrar | CuentaPorCobrarDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CuentaPorCobrar | CuentaPorCobrarDTO>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
