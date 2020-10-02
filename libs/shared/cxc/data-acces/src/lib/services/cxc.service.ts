import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import forIn from 'lodash/forin';

import {
  Periodo,
  CuentaPorCobrarDTO,
  CuentaPorCobrar,
  Cartera,
  DevolucionDto,
  Devolucion,
} from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CxcService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') private api) {
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
    pendientes: boolean,
    max = 50
  ): Observable<CuentaPorCobrarDTO[]> {
    const url = `${this.apiUrl}/facturas`;
    const data = periodo.toApiJSON();
    let params = new HttpParams()
      .set('cartera', cartera.clave)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    if (pendientes) {
      params = params.set('pendientes', 'true');
    }
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

  search(searchParams: {}): Observable<CuentaPorCobrar[]> {
    const url = `${this.apiUrl}/search`;
    let params = new HttpParams();
    forIn(searchParams, (value, key) => {
      params = params.set(key, value);
    });
    return this.http
      .get<CuentaPorCobrar[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  rmdPendientes(clienteId: string, cartera: string): Observable<Devolucion[]> {
    const url = `${this.api}/cxc/notas/buscarRmd`;
    let params = new HttpParams()
      //.set('clienteId', clienteId)
      .set('cartera', cartera);
    if(clienteId) {
      params = params.set('clienteId', clienteId)
    }
    return this.http
      .get<Devolucion[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<CuentaPorCobrar | CuentaPorCobrarDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CuentaPorCobrar | CuentaPorCobrarDTO>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  antiguedadDeSaldos(): Observable<any[]> {
    const url = `${this.api}/cxc/antiguedad`;
    return this.http
      .get<any[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
