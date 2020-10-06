import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CuentaPorCobrar } from '@nx-papelsa/shared/utils/core-models';
import { Observable } from 'rxjs';
import { CxcService } from '../services/cxc.service';

@Injectable({ providedIn: 'root' })
export class CxcItemResolver implements Resolve<CuentaPorCobrar> {
  constructor(private service: CxcService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CuentaPorCobrar> {
    const id = route.paramMap.get('id');
    console.log('Buscando cuenta por cobrar: ', id);
    return this.service.fetch(id);
  }
}
