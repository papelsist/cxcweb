import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cxc-bonificacion-header',
  template: `
    <div
      class="header"
      fxLayout
      fxLayoutAlign="start center"
      fxLayoutGap="10px"
    >
      <span class="mat-title">
        Nota: {{ bonificacion.serie }}-{{ bonificacion.folio }}
      </span>

      <div
        fxFlex
        fxLayout
        fxLayoutAlign="start center"
        fxLayoutGap="10px"
        class="mat-title"
      >
        <span>
          {{ bonificacion.nombre }}
        </span>
      </div>
      <div class="mat-title">
        <span>Fecha: {{ bonificacion.fecha | date: 'dd/MM/yyyy' }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .mat-title {
        margin: 0 0 8px;
        font-size: 1.1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonificacionHeaderComponent implements OnInit {
  @Input() bonificacion: Partial<NotaDeCredito>;
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}
}
