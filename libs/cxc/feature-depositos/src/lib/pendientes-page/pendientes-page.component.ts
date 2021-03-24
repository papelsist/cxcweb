import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { DepositosService } from '@nx-papelsa/shared/cxc/data-access-depositos';
import { SolicitudDeDeposito } from '@nx-papelsa/shared/cxc/data-access-depositos';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';
import { TdDialogService } from '@covalent/core/dialogs';
import { catchError, delay, finalize, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';
import { TdLoadingService } from '@covalent/core/loading';
import { MatDialog } from '@angular/material/dialog';

import { DepositoCreateComponent } from './deposito-create/deposito-create.component';

@Component({
  selector: 'nx-papelsa-depositos-pendientes',
  templateUrl: './pendientes-page.component.html',
  styleUrls: ['./pendientes-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesPageComponent extends BaseComponent implements OnInit {
  pendientes$: Observable<SolicitudDeDeposito[]>;
  pendientes: SolicitudDeDeposito[] = [];

  periodo: Periodo;
  filter$ = new BehaviorSubject<string>('');

  STORAGE_KEY = 'nx-papelsa-cxc-solicitudes-page.periodo';
  constructor(
    private router: Router,
    private service: DepositosService,
    private dialog: TdDialogService,
    private cd: ChangeDetectorRef,
    private loading: TdLoadingService,
    private modal: MatDialog
  ) {
    super();
    this.periodo = Periodo.fromNow(10);
  }

  ngOnInit() {
    this.reload();
  }

  onCreate(deposito: SolicitudDeDeposito) {
    console.log('Salvando solicitud de deposito: ', deposito);
    this.service.save(deposito).subscribe(
      (r) => {
        this.dialog
          .openAlert({
            title: 'Solicitud generada',
            message: 'Folio: ' + r.folio,
          })
          .afterClosed()
          .subscribe(() => this.reload());
      },
      (err) => this.handleError(err)
    );
  }

  reload() {
    this.loading.register('loading-pendientes');
    // console.log('Cargando solicitudes pendientes de autorizacion');
    this.service
      .pendientes()
      .pipe(
        delay(500),
        catchError((err) => {
          this.handleError(err);
          return of([]);
        }),
        finalize(() => this.loading.resolve('loading-pendientes')),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => (this.pendientes = res));
  }

  onPeriodoChanged(periodo: Periodo) {
    this.periodo = periodo;
    this.reload();
  }

  filter(event: string) {
    this.filter$.next(event);
  }

  onDrilldown(event: SolicitudDeDeposito) {
    this.modal
      .open(DepositoCreateComponent, {
        width: '60%',
        minHeight: '500px',
        data: {
          deposito: event,
        },
      })
      .afterClosed()
      .subscribe((payload) => {
        if (payload) {
          console.log('Salvar: ', payload);
          if (event.rechazo) payload.rechazo = null;
          this.service.update({ id: event.id, changes: payload }).subscribe(
            (r) => {
              this.dialog
                .openAlert({
                  title: 'Solicitud actualizada',
                  message: 'Folio: ' + r.folio,
                })
                .afterClosed()
                .subscribe(() => this.reload());
            },
            (err) => this.handleError(err)
          );
        }
      });
  }

  handleError(err: any) {
    this.dialog.openAlert({
      title: 'Error de persistencia',
      message: err.message,
      closeButton: 'Cerrar',
      minWidth: '50%',
    });
  }
}
