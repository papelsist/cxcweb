import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TdDialogService } from '@covalent/core/dialogs';
import { Update } from '@ngrx/entity';
import { Cliente, MedioDeContacto } from '@nx-papelsa/shared/utils/core-models';
import { CorreoDialogComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-correos-panel',
  template: `
    <div class="correos-panel">
      <mat-form-field *ngFor="let email of correos; index as i">
        <mat-label>Email: ({{ i + 1 }})</mat-label>
        <input type="email" matInput [value]="email.descripcion" disabled />
        <button mat-icon-button matSuffix (click)="onEdit(email, i)">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button matSuffix (click)="onDelete(email, i)">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .correos-panel {
        display: grid;
        align-items: center;
        gap: 5px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }
    `,
  ],
})
export class CorreosPanelComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() edit = new EventEmitter<Update<MedioDeContacto>>();
  @Output() delete = new EventEmitter<MedioDeContacto>();

  constructor(
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {}

  get correos(): MedioDeContacto[] {
    return this.cliente.medios.filter(
      (item) => item.tipo === 'MAIL' && !item.cfdi
    );
  }

  onEdit(medio: MedioDeContacto, index: number) {
    this.dialog
      .open(CorreoDialogComponent, {
        data: {
          email: medio.descripcion,
          title: `Modificando correo (${index + 1})`,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const med: Update<MedioDeContacto> = {
            id: medio.id,
            changes: { descripcion: res },
          };
          this.edit.emit(med);
        }
      });
  }

  onDelete(medio: MedioDeContacto, index: number) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar',
        message: 'Telefono: ' + medio.descripcion,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.delete.emit(medio);
        }
      });
  }
}
