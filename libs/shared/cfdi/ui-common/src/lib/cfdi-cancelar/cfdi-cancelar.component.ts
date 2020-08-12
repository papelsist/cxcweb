import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Cfdi } from '@nx-papelsa/shared/utils/core-models';
import { TdDialogService } from '@covalent/core/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { CfdiCancelarDialogComponent } from '../components';

@Component({
  selector: 'nx-papelsa-cfdi-cancelar',
  template: `
    <button
      mat-button
      (click)="onCancelar()"
      [color]="color"
      [disabled]="disabled"
    >
      <mat-icon>cancel</mat-icon>
      <span>{{ title }}</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiCancelarComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() color = 'warn';
  @Input() disabled = false;
  @Input() title = 'Cancelar CFDI';
  @Output() cancelar = new EventEmitter();
  loading = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onCancelar() {
    this.dialog
      .open(CfdiCancelarDialogComponent, { data: {}, minWidth: '450px' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.cancelar.emit({ cfdiId: this.cfdi.id, motivo: res });
        }
      });
  }
}
