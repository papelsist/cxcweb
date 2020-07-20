import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
}
