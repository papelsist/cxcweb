import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cxc-devolucion-header',
  template: `
    <div
      class="header"
      fxLayout
      fxLayoutAlign="start center"
      fxLayoutGap="10px"
    >
      <span class="mat-title">
        Nota: {{ devolucion.serie }}-{{ devolucion.folio }}
      </span>

      <div
        fxFlex
        fxLayout
        fxLayoutAlign="start center"
        fxLayoutGap="10px"
        class="mat-title"
      >
        <span>
          {{ devolucion.nombre }}
        </span>
      </div>
      <div class="mat-title">
        <span>Fecha: {{ devolucion.fecha | date: 'dd/MM/yyyy' }}</span>
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
export class DevolucionHeaderComponent implements OnInit {
  @Input() devolucion: Partial<NotaDeCredito>;
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}
}
