import { Component, OnInit } from '@angular/core';

import { Periodo, Cobro, Cartera } from '@nx-papelsa/shared/utils/core-models';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';

import { Observable } from 'rxjs';

@Component({
  selector: 'nx-papelsa-cobros-page',
  templateUrl: './cobros-page.component.html',
  styleUrls: ['./cobros-page.component.scss'],
})
export class CobrosPageComponent implements OnInit {
  cartera$ = this.cxcFacade.cartera$;
  periodo$: Observable<Periodo>;

  cobros$: Observable<Cobro[]>;
  loading$: Observable<boolean>;

  search$: Observable<string>;

  constructor(private cxcFacade: CXCFacade) {}

  ngOnInit(): void {}

  reload(periodo: Periodo, cartera: Cartera) {
    // this.facade.loadBonificaciones(periodo, cartera.clave);
  }

  onDrillDown(event: Partial<Cobro>, cartera: Cartera) {
    // this.facade.edit(event, cartera);
  }

  filter(event: string) {
    // this.facade.setSearchTerm(event);
  }

  cambiarPeriodo(periodo: Periodo) {
    // this.facade.cambiarPeriodo(periodo);
  }
}
