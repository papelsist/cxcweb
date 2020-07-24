import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BonificacionesEntity,
  BonificacionesFacade,
} from '@nx-papelsa/shared/cxc/data-access-bonificaciones';
import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-bonificacion-page',
  templateUrl: './bonificacion-page.component.html',
  styleUrls: ['./bonificacion-page.component.scss'],
})
export class BonificacionPageComponent implements OnInit {
  bonificacion$: Observable<BonificacionesEntity>;

  constructor(private facade: BonificacionesFacade) {
    this.bonificacion$ = facade.selectedBonificacion$;
  }

  ngOnInit(): void {}

  onTimbrar(bonificacion: Partial<NotaDeCredito>) {}
  onCancelar(bonificacion: Partial<NotaDeCredito>) {}
  onDelete(bonificacion: Partial<NotaDeCredito>) {}
}
