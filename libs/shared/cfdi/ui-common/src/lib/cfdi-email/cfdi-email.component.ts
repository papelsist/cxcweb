import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { finalize } from 'rxjs/operators';

import { TdLoadingService } from '@covalent/core/loading';

import { CfdiService } from '@nx-papelsa/shared/cfdi/data-access';
import { Cfdi } from '@nx-papelsa/shared/utils/core-models';
import { CfdiUiService } from '../services/cfdi-ui.service';
import { MatDialog } from '@angular/material/dialog';
import { CfdiEnvioDialogComponent } from '../components';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-cfdi-email',
  template: `
    <button mat-button type="button" (click)="send()">
      <mat-icon>email</mat-icon>
      <span>Enviar</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiEmailComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() nombre: string;
  @Input() target: string;
  @Input() color = 'primary';
  loading = false;

  constructor(
    private service: CfdiService,
    private loadingService: TdLoadingService,
    private cfdiUiService: CfdiUiService,
    private dialog: MatDialog,
    private dialogSerice: TdDialogService
  ) {}

  ngOnInit(): void {
    if (!this.nombre) this.nombre = this.cfdi.receptor;
  }

  send() {
    console.log('Enviando: ', this.cfdi);
    this.dialog
      .open(CfdiEnvioDialogComponent, {
        data: { email: this.target, nombre: this.nombre || this.cfdi.receptor },
        width: '450px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Enviar cfdi a: ', res);
          this.doSend(this.cfdi, res);
        }
      });
  }

  private doSend(cfdi: Partial<Cfdi>, target: string) {
    this.loadingService.register();
    this.service
      .enviar(cfdi, target, this.nombre)
      .pipe(finalize(() => this.loadingService.resolve()))
      .subscribe(
        (res) => {
          this.dialogSerice.openAlert({
            title: 'Envio de Comprobantes',
            message: 'Comprobantes enviados correctamente',
            closeButton: 'Cerrar',
          });
        },
        (error) => console.error(error)
      );
  }
}
