import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TdDialogService } from '@covalent/core/dialogs';
import { Update } from '@ngrx/entity';
import {
  Cliente,
  ClienteComentario,
} from '@nx-papelsa/shared/utils/core-models';
import { ComentarioDialogComponent } from './comentario-dialog.component';

@Component({
  selector: 'nx-papelsa-comentarios-panel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Comentarios</mat-card-title>
      </mat-card-header>
      <mat-divider></mat-divider>
      <div fxLayout="column">
        <mat-list>
          <mat-list-item
            *ngFor="let c of cliente.comentarios; index as idx; last as lst"
          >
            <mat-icon matListIcon>text_snippet</mat-icon>
            <h3 matLine>
              {{ c.comentario }}
            </h3>
            <p matLine fxLayout fxLayoutGap="10px" class="comentario">
              <span>Fecha: {{ c.fecha | date: 'dd/MM/yyyy' }}</span>
              <span
                >Status:
                <span [ngClass]="{ activo: c.activo, inactivo: !c.activo }">{{
                  c.activo ? 'ACTIVO' : 'INACTIVO'
                }}</span></span
              >
            </p>
            <p matLine fxLayout fxLayoutGap="10px">
              <span
                >Crado por: <strong>{{ c.createUser }}</strong></span
              >
            </p>
            <p matLine fxLayout fxLayoutGap="10px">
              <span
                >Actualizado po: <strong>{{ c.updateUser }}</strong>
              </span>
              <span>({{ c.lastUpdated | date: 'dd/MM/yyy HH:mm' }})</span>
            </p>
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

      .inactivo {
        padding: 5px;
        background-color: red;
        color: white;
      }
      .activo {
        padding: 5px;
        background-color: green;
        color: white;
      }
    `,
  ],
})
export class ComentariosPanelComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() update = new EventEmitter<Update<ClienteComentario>>();
  @Output() delete = new EventEmitter<ClienteComentario>();
  @Output() create = new EventEmitter<ClienteComentario>();

  constructor(
    private dialogService: TdDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  get comentarios(): ClienteComentario[] {
    return this.cliente.comentarios;
  }

  onCreate() {
    this.dialog
      .open(ComentarioDialogComponent, {
        width: '650px',
        data: {},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.create.emit(res);
        }
      });
  }

  onEdit(comentario: ClienteComentario, index: number) {
    this.dialog
      .open(ComentarioDialogComponent, {
        data: { comentario },
        width: '650px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.update.emit(res);
        }
      });
  }

  onDelete(comentario: ClienteComentario, index: number) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar comentario',
        message: comentario.comentario,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.delete.emit(comentario);
        }
      });
  }
}
