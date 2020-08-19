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

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private snackBar: MatSnackBar,
    private _loadingService: TdLoadingService
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

  runReport(url: string, repParams = {}) {
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
}
