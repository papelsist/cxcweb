import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable, of } from 'rxjs';
import {
  tap,
  filter,
  take,
  switchMap,
  catchError,
  withLatestFrom,
  map,
} from 'rxjs/operators';
import { FacturasFacade } from '../+state/facturas.facade';
import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';

@Injectable()
export class FacturasGuard implements CanActivate {
  constructor(private facade: FacturasFacade, private cxcFacade: CXCFacade) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    const cartera$ = this.cxcFacade.cartera$;
    const periodo$ = this.facade.periodo$;
    const loaded$ = this.facade.loaded$;
    const res$ = loaded$.pipe(
      withLatestFrom(periodo$, cartera$),
      tap(([loaded, periodo, cartera]) => {
        if (!loaded) {
          this.facade.load();
        }
      }),
      map(([loaded, periodo]) => loaded),
      filter((loaded) => loaded),
      take(1)
    );
    return res$;
  }
}
