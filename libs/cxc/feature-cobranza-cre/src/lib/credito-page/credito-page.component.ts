import { Component, OnInit } from '@angular/core';

import { NavigationRoute } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-credito-page',
  templateUrl: './credito-page.component.html',
  styleUrls: ['./credito-page.component.scss'],
})
export class CreditoPageComponent implements OnInit {
  features: NavigationRoute[] = [
    {
      path: 'facturas',
      label: 'Facturas',
      description: 'Cuentas por cobrar ',
      icon: 'toc',
    },
    {
      path: 'cobros',
      label: 'Cobros',
      description: 'Aplicaciones de cobros',
      icon: 'payments',
    },
    {
      path: 'devoluciones',
      label: 'Devoluciones',
      description: 'Notas de crédito por devolución',
      icon: 'thumb_down_alt',
    },
    {
      path: 'bonificaciones',
      label: 'Bonificaciones',
      description: 'Notas de crédito por descuento',
      icon: 'all_inbox',
    },
    {
      path: 'cargos',
      label: 'Cargos',
      description: 'Notas de cargo',
      icon: 'playlist_add',
    },
    {
      path: 'mejores',
      label: 'Bonificaciones MC',
      description: 'Mejores clientes',
      icon: 'redeem',
    },
  ];

  constructor() {
    console.log('Credito main page loaded...');
  }

  ngOnInit(): void {}
}
