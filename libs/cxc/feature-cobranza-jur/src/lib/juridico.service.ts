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
export class JuridicoService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') private api) {
    this.apiUrl = `${api}/cxc/juridico`;
  }

  list(periodo: Periodo, max = 1000): Observable<CuentaPorCobrarDTO[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('sort', 'traspaso')
      .set('order', 'desc')
      .set('max', max.toString());
    return this.http
      .get<CuentaPorCobrarDTO[]>(this.apiUrl, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
