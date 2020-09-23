import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VentaCommand, VentaMensual } from '../ventas-page/ventas-models';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') private api) {
    this.apiUrl = `${api}/analytics`;
  }

  ventasMensuales(config: VentaCommand): Observable<VentaMensual[]> {
    const url = `${this.apiUrl}/ventaMensual`;
    let params = new HttpParams();
    Object.keys(config).forEach((key) => {
      params = params.set(key, config[key].toString());
    });
    return this.http
      .get<VentaMensual[]>(url, { params })
      .pipe(catchError((error: any) => throwError(error)));
  }
}
