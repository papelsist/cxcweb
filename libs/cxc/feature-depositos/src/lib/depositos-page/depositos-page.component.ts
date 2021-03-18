import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NavigationRoute } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-depositos-page',
  templateUrl: './depositos-page.component.html',
  styleUrls: ['./depositos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositosPageComponent implements OnInit {
  features: NavigationRoute[] = [
    {
      path: 'pendientes',
      label: 'Pendientes',
      description: 'Solicitudes pendientes  ',
      icon: 'toc',
    },
    // {
    //   path: 'autorizados',
    //   label: 'Autorizadas',
    //   description: 'Solicitudes autorizadas',
    //   icon: 'payments',
    // },
  ];

  constructor() {}

  ngOnInit(): void {}
}
