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
import { Update } from '@ngrx/entity';

@Component({
  selector: 'nx-papelsa-credito-card',
  templateUrl: './credito-card.component.html',
  styleUrls: ['./credito-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditoCardComponent implements OnInit {
  @Input() credito: ClienteCredito;
  @Output() edit = new EventEmitter<Update<ClienteCredito>>();
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
}
