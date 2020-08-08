import { Component, OnInit } from '@angular/core';

import { FacturasFacade } from '@nx-papelsa/shared/cxc/data-access-facturas';

@Component({
  selector: 'nx-papelsa-factura-page',
  templateUrl: './factura-page.component.html',
  styleUrls: ['./factura-page.component.scss'],
})
export class FacturaPageComponent implements OnInit {
  factura$ = this.facade.selectedFactura$;
  constructor(private facade: FacturasFacade) {}

  ngOnInit(): void {}
}
