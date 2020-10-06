import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { ITdDataTableColumn } from '@covalent/core/data-table';
import { CuentaPorCobrar } from '@nx-papelsa/shared/utils/core-models';
import {
  BaseComponent,
  FormatService,
} from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-panel',
  templateUrl: './cxc-panel.component.html',
  styleUrls: ['./cxc-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxcPanelComponent extends BaseComponent implements OnInit {
  @Input() cxc: CuentaPorCobrar;
  columns: ITdDataTableColumn[] = [
    { name: 'clave', label: 'Producto' },
    { name: 'descripcion', label: 'Descripción', width: 300 },
    {
      name: 'precio',
      label: 'Precio',
      format: (v) => this.service.formatCurrency(v),
    },
    { name: 'cantidad', label: 'Cantidad' },
    {
      name: 'importe',
      label: 'Precio',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'descuentoImporte',
      label: 'Descuento',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'subtotal',
      label: 'Sub Total',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'impuesto',
      label: 'Impuesto',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'total',
      label: 'Total',
      format: (v) => this.service.formatCurrency(v),
    },
  ];
  constructor(private service: FormatService) {
    super();
  }

  ngOnInit(): void {}
}
