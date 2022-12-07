import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { Periodo, Cobro } from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root',
})
export class CobroService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/cobro`;
  }

  list(
    periodo: Periodo,
    cartera: string,
    disponibles = false,
    porTimbrar = false,
    max = 500
  ): Observable<Cobro[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera === 'CON' ? 'COD' : cartera)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('disponibles', disponibles.toString())
      .set('porTimbrar', porTimbrar.toString())
      .set('rows', max.toString());
    return this.http
      .get<Cobro[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  disponibles(cartera: string) {
    const url = `${this.apiUrl}/disponibles`;
    const params = new HttpParams().set('cartera', cartera);
    return this.http
      .get<Cobro[]>(url, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<Cobro> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Cobro>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: Update<Cobro>): Observable<Cobro> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<Cobro>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  aplicarCobros(id: string, cuentas: string[]): Observable<Cobro> {
    const url = `${this.apiUrl}/aplicar/${id}`;
    const payload = { cobro: id, cuentas };
    return this.http
      .put<Cobro>(url, payload)
      .pipe(catchError((error: any) => throwError(error)));
  }

  eliminarAplicacion(id: string, aplicaciones: string[]): Observable<Cobro> {
    const url = `${this.apiUrl}/eliminarAplicacion/${id}`;
    const payload = { cobro: id, aplicaciones };
    return this.http
      .put<Cobro>(url, payload)
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarRecibo(id: string): Observable<Cobro> {
    const url = `${this.apiUrl}/timbrar/${id}`;
    return this.http
      .put<Cobro>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarReciboV4(id: string): Observable<Cobro> {
    console.log('Timbrando recibo de pago en CFDI 4 desde el service');
    const url = `${this.apiUrl}/timbrarV4/${id}`;
    return this.http
      .put<Cobro>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelarRecibo(id: string, motivo: string): Observable<Cobro> {
    const url = `${this.apiUrl}/cancelarRecibo/${id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http
      .put<Cobro>(url, {}, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  saldar(cobroId: string): Observable<Cobro> {
    const url = `${this.apiUrl}/saldar/${cobroId}`;
    return this.http.put<Cobro>(url, {});
  }
}
