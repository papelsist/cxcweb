import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ClienteCredito } from '@nx-papelsa/shared/utils/core-models';
import { MatDialog } from '@angular/material/dialog';
import { CreditoFormComponent } from '../credito-form/credito-form.component';
import { AtrasoFormComponent } from '../atraso-form/atraso-form.component';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'nx-papelsa-credito-card',
  templateUrl: './credito-card.component.html',
  styleUrls: ['./credito-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditoCardComponent implements OnInit {
  @Input() credito: ClienteCredito;
  @Input() roleDeAutorizacion: Boolean
  @Output() edit = new EventEmitter<Update<ClienteCredito>>();
  dias = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miercoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
  };
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  editar() {
    this.dialog
      .open(CreditoFormComponent, { data: { credito: this.credito } })
      .afterClosed()
      .subscribe((res: Update<ClienteCredito>) => {
        if (res) {
          this.edit.emit(res);
        }
      });
  }
  editarAtraso() {
    this.dialog
      .open(AtrasoFormComponent, { data: { credito: this.credito } })
      .afterClosed()
      .subscribe((res: Update<ClienteCredito>) => {
        if (res) {
          this.edit.emit(res);
        }
      });
  }
}
