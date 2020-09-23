import { Component, OnDestroy, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';

import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { AnalyticsStateService } from '../services/analytics-state.service';

@Component({
  selector: 'papx-cxc-ventas-page',
  templateUrl: './ventas-page.component.html',
  styleUrls: ['./ventas-page.component.scss'],
})
export class VentasPageComponent extends BaseComponent
  implements OnInit, OnDestroy {
  registros: any[] = [];
  isSidebarVisible$ = this.analyticsService.isDrawerVisible$;
  visible = true;
  searchTerm: string;
  // links = ['Mensual', 'Acumulada', 'Por Cliente'];
  links = [
    { path: 'mensual', label: 'Mensual' },
    { path: 'acumulada', label: 'Acumulada' },
    { path: 'cliente', label: 'Análisis por Cliente' },
  ];
  activeLink = null; // this.links[0];
  constructor(
    private loadingService: TdLoadingService,
    private analyticsService: AnalyticsStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isSidebarVisible$.subscribe((val) => (this.visible = val));
  }

  load() {}

  filtrar(term: string) {
    this.searchTerm = term;
  }

  toobleSidebar(val: boolean) {
    // this.isSidebarVisible$.next(val);
    this.analyticsService.toogleDrawer(val);
  }

  onSelection(event: any) {}

  ngOnDestroy() {}
}
