import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Periodo, DevolucionDto, Devolucion } from '@nx-papelsa/shared/utils/core-models';

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

  list(
    periodo: Periodo = Periodo.fromNow(30),
    max = 20,
    cartera = 'CRE'
  ): Observable<any[]> {
    const data = periodo.toApiJSON();
    const params = new HttpParams()
      .set('cartera', cartera)
      .set('fechaInicial', data.fechaInicial)
      .set('fechaFinal', data.fechaFinal)
      .set('max', max.toString());
    return this.http
      .get<any[]>(this.apiUrl, { params: params })
      .pipe(
        map((rows) =>
          rows.map((item) => {
            const {
              id,
              documento,
              fecha,
              sucursal: { nombre },
              total,
              venta,
              nota,
              nota: { cfdi },
            } = item;
            return {
              id,
              documento,
              fecha,
              sucursal: nombre,
              nombre: venta.cliente.nombre,
              cliente: venta.cliente.id,
              total,
              nota,
              factura: venta.folio,
              cfdi: cfdi.uuid,
            };
          })
        ),
        catchError((error: any) => throwError(error))
      );
  }

  get(id: string): Observable<Devolucion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<Devolucion>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
