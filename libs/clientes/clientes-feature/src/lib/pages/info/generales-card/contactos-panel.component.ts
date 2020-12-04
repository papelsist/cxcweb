import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Update } from '@ngrx/entity';

import { MatDialog } from '@angular/material/dialog';
import { TdDialogService } from '@covalent/core/dialogs';

import { Cliente, ClienteContacto } from '@nx-papelsa/shared/utils/core-models';
import { ContactoDialogComponent } from './contacto-dialog.component';

@Component({
  selector: 'nx-papelsa-contactos-panel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Contactos</mat-card-title>
      </mat-card-header>
      <mat-divider></mat-divider>
      <div fxLayout="column">
        <mat-list>
          <mat-list-item
            *ngFor="let c of cliente.contactos; index as idx; last as lst"
          >
            <mat-icon matListIcon>text_snippet</mat-icon>
            <h3 matLine>
              {{ c.nombre }}
            </h3>
            <p matLine fxLayout fxLayoutGap="10px">
              <span>Puesto: {{ c.puesto }}</span>
              <span>Tel: {{ c.telefono }}</span>
            </p>
            <p matLine fxLayout fxLayoutGap="10px">Email: {{ c.email }}</p>
            <button mat-icon-button (click)="onEdit(c, idx)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="onDelete(c, idx)">
              <mat-icon color="warn">delete</mat-icon>
            </button>
            <mat-divider *ngIf="!lst"></mat-divider>
          </mat-list-item>
        </mat-list>
      </div>
      <mat-divider></mat-divider>
      <mat-card-actions>
        <button mat-button color="accent" (click)="onCreate()">
          <mat-icon>add</mat-icon>
          <mat-label>Agregar</mat-label>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .comentarios-panel {
        display: grid;
        align-items: center;
        gap: 5px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }
    `,
  ],
})
export class ContactosPanelComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() update = new EventEmitter<Update<ClienteContacto>>();
  @Output() delete = new EventEmitter<ClienteContacto>();
  @Output() create = new EventEmitter<ClienteContacto>();

  constructor(
    private dialogService: TdDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  get contactos(): ClienteContacto[] {
    return this.cliente.contactos;
  }

  onCreate() {
    this.dialog
      .open(ContactoDialogComponent, {
        width: '600px',
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.create.emit(res);
        }
      });
  }

  onEdit(contacto: ClienteContacto, index: number) {
    this.dialog
      .open(ContactoDialogComponent, {
        data: { contacto },
        width: '600px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.update.emit(res);
        }
      });
  }

  onDelete(contacto: ClienteContacto, index: number) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar contacto',
        message: contacto.nombre,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.delete.emit(contacto);
        }
      });
  }
}
