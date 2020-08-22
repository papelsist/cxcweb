import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  CfdiDto,
  Cfdi,
  GrupoDeCfdis,
} from '@nx-papelsa/shared/utils/core-models';

@Injectable({
  providedIn: 'root',
})
export class CfdiService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cfdis`;
  }

  mostrarXml(cfdi: Partial<Cfdi>) {
    const url = `${this.apiUrl}/mostrarXml/${cfdi.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http
      .get(url, {
        headers: headers,
        responseType: 'blob',
      })
      .subscribe((res) => {
        const blob = new Blob([res], {
          type: 'text/xml',
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      });
  }

  printCfdi(cfdi: Partial<Cfdi>): Observable<any> {
    const url = `${this.apiUrl}/print/${cfdi.id}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
    });
  }

  timbrar(cfdi: Partial<Cfdi>): Observable<Cfdi> {
    const url = `${this.apiUrl}/${cfdi.id}`;
    return this.http
      .put<Cfdi>(url, { data: {} })
      .pipe(catchError((error: any) => throwError(error)));
  }

  enviar(cfdi: Partial<CfdiDto>, target: string, nombre: string) {
    const cfdis = [cfdi];
    const grupos: GrupoDeCfdis[] = [{ nombre, target, cfdis }];
    return this.enviarComprobantes(grupos);
  }

  enviarComprobantes(registros: GrupoDeCfdis[]) {
    const payload = {
      grupos: registros.map((r) => {
        const { target, nombre, zip } = r;
        const cfdis = r.cfdis.map((item) => item.id);
        return { target, nombre, zip, cfdis };
      }),
    };

    const url = `${this.apiUrl}/enviarComprobantes`;
    return this.http
      .put(url, payload)
      .pipe(catchError((error: any) => throwError(error)));
  }

  mostrarCancelacionXml(cfdi: Partial<Cfdi>) {
    const url = `${this.apiUrl}/mostrarAcuseDeCancelacionXml/${cfdi.id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http
      .get(url, {
        headers: headers,
        responseType: 'blob',
      })
      .subscribe((res) => {
        const blob = new Blob([res], {
          type: 'text/xml',
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      });
  }
}
