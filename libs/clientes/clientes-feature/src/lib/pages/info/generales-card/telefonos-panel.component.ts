import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';
import { Cliente, MedioDeContacto } from '@nx-papelsa/shared/utils/core-models';
import { TelefonoDialogComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-telefonos-panel',
  template: `
    <div class="telefonos-panel">
      <mat-form-field *ngFor="let tel of telefonos; index as i">
        <mat-label>Teléfono ({{ i + 1 }})</mat-label>
        <input type="tel" matInput [value]="tel.descripcion" disabled />
        <button mat-icon-button matSuffix (click)="onEdit(tel, i)">
          <mat-icon>edit</mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .telefonos-panel {
        display: grid;
        align-items: center;
        gap: 5px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }
    `,
  ],
})
export class TelefonosPanelComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() edit = new EventEmitter<Update<MedioDeContacto>>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  get telefonos(): MedioDeContacto[] {
    return this.cliente.medios.filter((item) => item.tipo === 'TEL');
  }

  onEdit(medio: MedioDeContacto, index: number) {
    this.dialog
      .open(TelefonoDialogComponent, {
        data: {
          telefono: medio.descripcion,
          title: `Modificando Teléfono (${index + 1})`,
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
}
