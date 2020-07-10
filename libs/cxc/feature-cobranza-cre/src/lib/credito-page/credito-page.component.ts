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
      path: 'devoluciones',
      label: 'Devoluciones',
      description: 'Notas de crédito por devolución',
      icon: 'thumb_down_alt',
    },
    {
      path: 'bonificaciones',
      label: 'Bonificaciones',
      description: 'Notas de crédito por descuento',
      icon: 'redeem',
    },
    {
      path: 'cargos',
      label: 'Cargos',
      description: 'Notas de cargo',
      icon: 'playlist_add',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
