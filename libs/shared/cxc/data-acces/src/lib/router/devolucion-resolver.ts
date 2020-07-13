import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { Devolucion } from '@nx-papelsa/shared/utils/core-models';
import { DevolucionesService } from '../devoluciones.service';

@Injectable({ providedIn: 'root' })
export class DevolucionResolver implements Resolve<Partial<Devolucion>> {
  constructor(private service: DevolucionesService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Partial<Devolucion>> | Partial<Devolucion> {
    const id = route.paramMap.get('id');
    return this.service.get(id);
  }
}
