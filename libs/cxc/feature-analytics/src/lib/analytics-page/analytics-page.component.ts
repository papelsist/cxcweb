import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigationRoute } from '@nx-papelsa/shared/utils/core-models';

import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { MatDrawer } from '@angular/material/sidenav';
import { AnalyticsStateService } from '../services/analytics-state.service';

@Component({
  selector: 'papx-cxc-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  isSmallScreen$: Observable<boolean>;
  mode$: Observable<'side' | 'over'>;

  routes: NavigationRoute[] = [
    {
      path: 'ventas',
      label: 'Ventas',
      description: 'Análisis de ventas',
      icon: 'bar_chart',
    },
    {
      path: 'antiguedad',
      label: 'Antigüedad',
      description: 'Antigüedad de Saldos',
      icon: 'multiline_chart',
    },
    {
      path: 'cartera',
      label: 'Cartera',
      description: 'Análisis de cartera',
      icon: 'pie_chart',
    },
  ];

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private analyticsService: AnalyticsStateService
  ) {
    super();
  }

  ngOnInit() {
    this.isSmallScreen$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map((brakPoint) => brakPoint.matches));

    this.mode$ = this.isSmallScreen$.pipe(
      map((value) => (value ? 'over' : 'side'))
    );
  }

  ngAfterViewInit(): void {
    this.analyticsService.drawerState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => this.drawer.toggle(val));

    this.drawer.openedChange.subscribe((change: boolean) => {
      this.analyticsService.isDrawerVisible$.next(change);
    });
  }
}
