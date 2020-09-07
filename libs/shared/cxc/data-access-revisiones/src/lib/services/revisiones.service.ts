import { throwError, Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Update } from '@ngrx/entity';

import { catchError } from 'rxjs/operators';

import { VentaCredito } from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class RevisionesService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/ventaCredito`;
  }

  list(): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/pendientes`;
    return this.http
      .get<VentaCredito[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(credito: VentaCredito): Observable<VentaCredito> {
    const url = `${this.apiUrl}/${credito.id}`;
    return this.http
      .put<VentaCredito>(url, credito)
      .pipe(catchError((error: any) => throwError(error)));
  }

  batchUpdate(command: {
    template: Object;
    facturas: string[];
  }): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/batchUpdate`;
    return this.http
      .post<VentaCredito[]>(url, command)
      .pipe(catchError((error: any) => throwError(error)));
  }

  registrarRecepcionCxc(
    recibidas: boolean,
    facturas: string[]
  ): Observable<VentaCredito[]> {
    return recibidas
      ? this.recepcionCxc(facturas)
      : this.cancelarRecepcionCxC(facturas);
  }

  recepcionCxc(facturas: string[]): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/registrarRecepcionCxC`;
    return this.http
      .put<VentaCredito[]>(url, { facturas })
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarRecepcionCxC(facturas: string[]): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/cancelarRecepcionCxC`;
    return this.http
      .put<VentaCredito[]>(url, { facturas })
      .pipe(catchError((error: any) => throwError(error)));
  }

  registrarRevision(
    revisada: boolean,
    facturas: string[]
  ): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/registrarRvisada`;
    const params = new HttpParams().set('value', revisada.toString());
    return this.http
      .put<VentaCredito[]>(url, { facturas }, { params })
      .pipe(catchError((error: any) => throwError(error)));

    // if (revisada) {
    //   return this.registrarRvisada(facturas);
    // } else {
    //   return this.cancelarRvisada(facturas);
    // }
  }

  registrarRvisada(facturas: string[]): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/registrarRvisada`;
    return this.http
      .put<VentaCredito[]>(url, { facturas })
      .pipe(catchError((error: any) => throwError(error)));
  }
  cancelarRvisada(facturas: string[]): Observable<VentaCredito[]> {
    const url = `${this.apiUrl}/cancelarRvisada`;
    return this.http
      .put<VentaCredito[]>(url, { facturas })
      .pipe(catchError((error: any) => throwError(error)));
  }

  actualizar(): Observable<Array<any>> {
    const url = `${this.apiUrl}/actualizar`;
    return this.http.get<Array<any>>(url);
  }

  generar(): Observable<any> {
    const url = `${this.apiUrl}/generar`;
    return this.http
      .post(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  recalcular(): Observable<any> {
    const url = `${this.apiUrl}/recalcular`;
    return this.http
      .post(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  reporteDeRevision(command: any) {
    let params = new HttpParams().set('fecha', command.fecha);
    if (command.cliente !== null) {
      params = params.set('cliente', command.cliente.id);
    }
    if (command.cobrador) {
      params = params.set('cobrador', command.cobrador.id);
    }

    const url = `${this.apiUrl}/print`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http
      .get(url, { headers: headers, responseType: 'blob', params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
