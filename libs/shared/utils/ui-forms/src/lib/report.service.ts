import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import forIn from 'lodash/forin';

import { TdLoadingService } from '@covalent/core/loading';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';
import { MatDialog } from '@angular/material/dialog';
import {
  PeriodoDialogComponent,
  FechaDialogComponent,
} from '@nx-papelsa/shared/utils/ui-common';

export interface ReportOptions {
  path: string;
  title?: string;
  subtitle?: string;
  params?: {};
}

@Injectable()
export class ReportService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private snackBar: MatSnackBar,
    private _loadingService: TdLoadingService,
    private dialog: MatDialog
  ) {
    this.apiUrl = api;
  }

  run(path: string, repParams = {}): Observable<any> {
    let params = new HttpParams();
    forIn(repParams, (value, key) => {
      params = params.set(key, value);
    });
    const url = `${this.apiUrl}/${path}`;
    const headers = new HttpHeaders().set('Content-type', 'application/pdf');
    return this.http.get(url, {
      headers: headers,
      params: params,
      responseType: 'blob',
    });
  }

  runReport(url: string, repParams = {}, callback?: any) {
    this._loadingService.register();
    this.run(url, repParams)
      .pipe(finalize(() => this._loadingService.resolve()))
      .subscribe(
        (res) => {
          const blob = new Blob([res], {
            type: 'application/pdf',
          });
          const fileUrl = window.URL.createObjectURL(blob);
          window.open(fileUrl, '_blank');
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          const desc = `${error.message}`;
          const message = `Error:${error.status}, Rep:${url}`;
          this.snackBar.open(message, 'Cerrar', { duration: 10000 });
        }
      );
  }

  runReportePorFecha(
    url: string,
    fecha: Date | string,
    params = {},
    title: string = null,
    subtitle: string = null,
    callback?: any
  ) {
    console.groupCollapsed('Reporte: ' + url);
    this.dialog
      .open(FechaDialogComponent, { data: { fecha, title, subtitle } })
      .afterClosed()
      .subscribe((res: Date) => {
        if (res) {
          const repParams = { fecha: res.toISOString(), ...params };
          console.log('Params: ', repParams);
          console.groupEnd();
          if (callback) {
            callback(res);
          }
          this.runReport(url, repParams, callback);
        }
      });
  }

  runReportePorPeriodo(
    url: string,
    periodo: Periodo,
    params = {},
    title: string = null,
    subtitle: string = null,
    callback: any
  ) {
    console.group('Reporte: ' + url);
    console.groupCollapsed();
    this.dialog
      .open(PeriodoDialogComponent, { data: { periodo, title, subtitle } })
      .afterClosed()
      .subscribe((per: Periodo) => {
        if (per) {
          const repParams = { ...per.toApiJSON(), ...params };
          console.log('Params: ', repParams);
          console.groupEnd();
          callback(per);
          this.runReport(url, repParams);
        }
      });
  }
}
