import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Periodo, DevolucionDto } from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class DevolucionesService {
  private apiUrl: string;

  // constructor(private http: HttpClient, @Inject('apiUrl') api: string) {
  //   this.apiUrl = `${api}/pedidos`;
  // }

  constructor(private http: HttpClient) {
    this.apiUrl = `http://localhost:9095/siipapx/api/devoluciones`;
  }

  list(periodo: Periodo = Periodo.mesActual()): Observable<any[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()

      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal);
    return this.http
      .get<DevolucionDto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
