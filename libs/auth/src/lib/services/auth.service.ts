import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import {
  Authenticate,
  AuthSession,
  SessionInfo,
} from '../+state/auth.entities';

@Injectable()
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = api;
  }

  login(authenticate: Authenticate): Observable<AuthSession> {
    const url = `${this.apiUrl}/login`;
    return this.http
      .post<AuthSession>(url, authenticate)
      .pipe(catchError((error: any) => throwError(error)));
  }

  fetchSession(): Observable<SessionInfo> {
    const url = `${this.apiUrl}/session`;
    return this.http
      .get<SessionInfo>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
