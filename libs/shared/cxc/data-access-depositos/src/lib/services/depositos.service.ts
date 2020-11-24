import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Periodo } from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';
import { Deposito } from '../+state/depositos.models';

@Injectable({
  providedIn: 'root',
})
export class DeposiosService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/depositos`;
  }

  list(periodo: Periodo, max = 50): Observable<Deposito[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<Deposito[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Deposito> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Deposito>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(deposito: Partial<Deposito>): Observable<Deposito> {
    return this.http
      .post<Deposito>(this.apiUrl, deposito)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<Deposito>): Observable<Deposito> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Deposito>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(deposito: Partial<Deposito>) {
    const url = `${this.apiUrl}/${deposito.id}`;
    return this.http
      .delete<Deposito>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  buscarDuplicado() {}
}
