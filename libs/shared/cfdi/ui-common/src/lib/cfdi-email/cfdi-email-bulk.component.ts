import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { finalize, take } from 'rxjs/operators';

import { TdLoadingService } from '@covalent/core/loading';

import { CfdiService } from '@nx-papelsa/shared/cfdi/data-access';
import {
  CuentaPorCobrarDTO,
  GrupoDeCfdis,
} from '@nx-papelsa/shared/utils/core-models';
import { groupByProperty } from '@nx-papelsa/shared/utils/collections';

import { EnvioBulkDialogComponent } from '../components';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-cfdi-email-bulk',
  template: `
    <button
      mat-menu-item
      type="button"
      (click)="send()"
      [disabled]="facturas.length <= 0"
    >
      <mat-icon>email</mat-icon>
      <span>{{ title }}</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiEmailBulkComponent implements OnInit {
  @Input() facturas: CuentaPorCobrarDTO[];
  @Input() target: string;
  @Input() color = 'primary';
  @Input() title = 'Envia';
  @Output() done = new EventEmitter();

  loading = false;

  constructor(
    private service: CfdiService,
    private loadingService: TdLoadingService,
    private dialog: MatDialog,
    private dialogSerice: TdDialogService
  ) {}

  ngOnInit(): void {}

  send() {
    const grupos = this.buildGrupos(this.facturas);
    this.dialog
      .open(EnvioBulkDialogComponent, {
        width: '60%',
        data: { grupos },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.doSend(grupos);
        }
      });
  }

  buildGrupos(rows: CuentaPorCobrarDTO[]): GrupoDeCfdis[] {
    const grupos = groupByProperty(rows, 'nombre');
    const res = Object.keys(grupos).map((key) => {
      const value: CuentaPorCobrarDTO[] = grupos[key];
      const cfdis = value.map((item) => item.cfdi);
      const { nombre, cfdiMail } = value[0].cliente;
      return { nombre, target: cfdiMail, cfdis };
    });
    return res;
  }

  private doSend(grupos: GrupoDeCfdis[]) {
    this.loadingService.register();
    this.service
      .enviarComprobantes(grupos)
      .pipe(
        take(1),
        finalize(() => {
          this.loadingService.resolve();
          this.done.emit(true);
        })
      )
      .subscribe(
        (res) => {
          const errores = [];
          Object.keys(res).forEach((key) => {
            const item = res[key];
            if (item.status === 'error') {
              errores.push(item);
            }
          });

          if (errores.length > 0) {
            this.handleMailErrors(errores);
          } else {
            this.dialogSerice.openAlert({
              title: 'Envio de Comprobantes',
              message: 'Comprobantes enviados correctamente',
              closeButton: 'Cerrar',
            });
          }
        },
        (err) => {
          this.dialogSerice.openAlert({
            title: 'Envio de comprobantes',
            message: `Error enviando correo(s): ${err.message}`,
            closeButton: 'Cerrar',
            width: '550px',
          });
        }
      );
  }

  handleMailErrors(errors: any[]) {
    console.error('Errores: ', errors);
    errors.forEach((err) => {
      this.dialogSerice.openAlert({
        title: 'Destino: ' + err.target,
        message: `${err.messageErrors}`,
        closeButton: 'Cerrar',
        width: '600px',
      });
    });
  }
}
