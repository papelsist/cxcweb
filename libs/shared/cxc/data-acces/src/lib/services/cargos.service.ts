import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import {
  Periodo,
  NotaDeCargoDto,
  NotaDeCargoCreateDto,
  NotaDeCargo,
} from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CargosService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cxc/notasDeCargo`;
  }

  list(
    periodo: Periodo = Periodo.fromNow(30),
    max = 50,
    cartera = 'CRE'
  ): Observable<NotaDeCargoDto[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<NotaDeCargoDto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  get(id: string): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<NotaDeCargo>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(cargo: NotaDeCargoCreateDto): Observable<NotaDeCargoDto> {
    return this.http
      .post<NotaDeCargoDto>(this.apiUrl, cargo)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: {
    id: string;
    changes: Partial<NotaDeCargo>;
  }): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<NotaDeCargo>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  timbrar(id: string): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/timbrar/${id}`;
    return this.http
      .post<NotaDeCargo>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  cancelar(id: string, motivo: string): Observable<NotaDeCargo> {
    const url = `${this.apiUrl}/cancelar/${id}`;
    const params = new HttpParams().set('motivo', motivo);
    return this.http.put<NotaDeCargo>(url, {}, { params }).pipe(
      delay(2000),
      catchError((error: any) => throwError(error))
    );
  }

  print(cargo: Partial<NotaDeCargo>) {
    const url = `${this.apiUrl}/print/${cargo.id}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
    });
  }
}
