import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Periodo, NotaDeCargoDto } from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CargosService {
  private apiUrl: string;

  // constructor(private http: HttpClient, @Inject('apiUrl') api: string) {
  //   this.apiUrl = `${api}/pedidos`;
  // }

  constructor(private http: HttpClient) {
    this.apiUrl = `http://localhost:8080/api/cargos`;
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
}
