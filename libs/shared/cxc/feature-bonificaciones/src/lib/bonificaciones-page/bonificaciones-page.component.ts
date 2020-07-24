import { Component, OnInit } from '@angular/core';

import { takeUntil, withLatestFrom, tap } from 'rxjs/operators';

import { BonificacionesFacade } from '@nx-papelsa/shared/cxc/data-access-bonificaciones';
import {
  Periodo,
  NotaDeCredito,
  Cartera,
} from '@nx-papelsa/shared/utils/core-models';
import { Subject, Observable } from 'rxjs';
import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BonificacionCreateDialogComponent } from './components/create-dialog/bonificacion-create-dialog.component';

@Component({
  selector: 'nx-papelsa-bonificaciones-page',
  templateUrl: './bonificaciones-page.component.html',
  styleUrls: ['./bonificaciones-page.component.scss'],
})
export class BonificacionesPageComponent implements OnInit {
  cartera$ = this.cxcFacade.cartera$;
  periodo$ = this.facade.periodo$;

  bonificaciones$: Observable<NotaDeCredito[]> = this.facade.allBonificaciones$;
  loading$ = this.facade.loading$;

  constructor(
    public facade: BonificacionesFacade,
    private cxcFacade: CXCFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  reload(periodo: Periodo, cartera: Cartera) {
    this.facade.loadBonificaciones(periodo, cartera.clave);
  }

  onCreate(cartera: Cartera) {
    this.dialog
      .open(BonificacionCreateDialogComponent, {
        data: { cartera },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Alta de Bonificacion: ', res);
          this.facade.save(res);
        }
      });
  }

  onDrillDown(event: Partial<NotaDeCredito>, cartera: Cartera) {
    this.facade.edit(event, cartera);
  }

  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  cambiarPeriodo(periodo: Periodo) {
    this.facade.cambiarPeriodo(periodo);
  }
}
