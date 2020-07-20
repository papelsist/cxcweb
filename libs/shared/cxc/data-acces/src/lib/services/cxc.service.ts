import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Periodo,
  CuentaPorCobrarDTO,
} from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CxcService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cuentasPorCobrar`;
  }

  facturasPendientes(clienteId: string): Observable<CuentaPorCobrarDTO[]> {
    const url = `${this.apiUrl}/pendientes/${clienteId}`;
    return this.http
      .get<CuentaPorCobrarDTO[]>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
