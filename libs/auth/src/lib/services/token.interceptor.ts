import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromAuth from '../+state/auth.reducer';
import { getToken } from '../+state/auth.selectors';
import { first, flatMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromAuth.AuthPartialState>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token$ = this.store.pipe(select(getToken), first());
    return token$.pipe(
      flatMap((token) => {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return next.handle(request);
      })
    );
  }
}
