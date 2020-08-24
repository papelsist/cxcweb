import { Component, OnInit } from '@angular/core';

import { Periodo, Cobro, Cartera } from '@nx-papelsa/shared/utils/core-models';

import { CobrosFacade } from '@nx-papelsa/shared/cxc/data-access-cobros';

@Component({
  selector: 'nx-papelsa-cobros-page',
  templateUrl: './cobros-page.component.html',
  styleUrls: ['./cobros-page.component.scss'],
})
export class CobrosPageComponent implements OnInit {
  cartera$ = this.facade.cartera$;
  loading$ = this.facade.loading$;
  periodo$ = this.facade.periodo$;
  cobros$ = this.facade.allCobros$;
  search$ = this.facade.search$;

  constructor(private facade: CobrosFacade) {}

  ngOnInit(): void {}

  reload(periodo: Periodo, cartera: Cartera) {
    this.facade.loadCobros(periodo, cartera.clave);
  }

  onDrillDown(event: Partial<Cobro>, cartera: Cartera) {
    this.facade.edit(event.id, cartera);
  }

  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  cambiarPeriodo(periodo: Periodo) {
    this.facade.cambiarPeriodo(periodo);
  }
}
