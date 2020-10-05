import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import {
  Cliente,
  ClienteCredito,
  MedioDeContacto,
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
}
