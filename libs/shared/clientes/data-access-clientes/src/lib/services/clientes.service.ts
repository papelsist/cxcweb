import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import {
  Cfdi,
  Cliente,
  ClienteCredito,
  Cobro,
  CuentaPorCobrarDTO,
  MedioDeContacto,
  NotaDeCredito,
  Periodo,
} from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/clientes`;
  }

  list(
    tipo: 'CREDITO' | 'CONTADO' | 'TODOS' = 'CREDITO',
    max = 100
  ): Observable<Cliente[]> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('max', max.toString());
    return this.http
      .get<Cliente[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Cliente>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<Cliente>): Observable<Cliente> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Cliente>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateCredito(
    clienteId: string,
    update: Update<ClienteCredito>
  ): Observable<ClienteCredito> {
    const url = `${this.apiUrl}/${clienteId}/credito/${update.id}`;
    return this.http
      .put<ClienteCredito>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateMedio(
    clienteId: string,
    update: Update<MedioDeContacto>
  ): Observable<MedioDeContacto> {
    const url = `${this.apiUrl}/${clienteId}/medios/${update.id}`;
    return this.http
      .put<MedioDeContacto>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  addMedio(
    clienteId: string,
    medio: Partial<MedioDeContacto>
  ): Observable<MedioDeContacto> {
    const url = `${this.apiUrl}/${clienteId}/medios`;
    return this.http
      .post<MedioDeContacto>(url, { cliente: clienteId, ...medio })
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteMedio(clienteId: string, medio: Partial<MedioDeContacto>) {
    const url = `${this.apiUrl}/${clienteId}/medios/${medio.id}`;
    return this.http
      .delete<MedioDeContacto>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  /**
   * Fetches facturas de venta de un cliente
   *
   * @param cliente
   * @param filtro
   */
  facturas(
    cliente: Cliente,
    filtro: ClienteSearchOptions
  ): Observable<CuentaPorCobrarDTO[]> {
    let params = new HttpParams();
    if (filtro.periodo) {
      const { fechaInicial, fechaFinal } = filtro.periodo;
      params = params
        .set('fechaInicial', fechaInicial.toISOString())
        .set('fechaFinal', fechaFinal.toISOString());
    }
    params = params.set('pendientes', filtro.pendientes.toString());
    const url = `${this.apiUrl}/${cliente.id}/facturas`;
    return this.http
      .get<CuentaPorCobrarDTO[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  notas(
    cliente: Cliente,
    filtro: ClienteSearchOptions
  ): Observable<NotaDeCredito[]> {
    let params = new HttpParams();
    if (filtro.periodo) {
      const { fechaInicial, fechaFinal } = filtro.periodo;
      params = params
        .set('fechaInicial', fechaInicial.toISOString())
        .set('fechaFinal', fechaFinal.toISOString());
    }
    params = params.set('pendientes', filtro.pendientes.toString());
    const url = `${this.apiUrl}/${cliente.id}/notas`;
    return this.http
      .get<NotaDeCredito[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  cobros(cliente: Cliente, filtro: ClienteSearchOptions): Observable<Cobro[]> {
    let params = new HttpParams();
    if (filtro.periodo) {
      const { fechaInicial, fechaFinal } = filtro.periodo;
      params = params
        .set('fechaInicial', fechaInicial.toISOString())
        .set('fechaFinal', fechaFinal.toISOString());
    }
    params = params.set('pendientes', filtro.pendientes.toString());
    const url = `${this.apiUrl}/${cliente.id}/cobros`;
    return this.http
      .get<Cobro[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  cfdis(cliente: Cliente, filtro: ClienteSearchOptions): Observable<Cfdi[]> {
    let params = new HttpParams();
    if (filtro.periodo) {
      const { fechaInicial, fechaFinal } = filtro.periodo;
      params = params
        .set('fechaInicial', fechaInicial.toISOString())
        .set('fechaFinal', fechaFinal.toISOString());
    }
    params = params.set('pendientes', 'false');
    const url = `${this.apiUrl}/${cliente.id}/cfdis`;
    return this.http
      .get<Cfdi[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}

export interface ClienteSearchOptions {
  pendientes: boolean;
  periodo?: Periodo;
}
