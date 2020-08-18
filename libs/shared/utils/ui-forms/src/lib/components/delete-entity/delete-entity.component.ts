import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-delete-entity',
  template: `
    <ng-container *ngIf="!inline; else inlineButton">
      <button mat-button (click)="onDelete()" [color]="color">
        <span>{{ label }}</span>
        <mat-icon>delete</mat-icon>
      </button>
    </ng-container>
    <ng-template #inlineButton>
      <button mat-icon-button (click)="onDelete()" [color]="color">
        <mat-icon>delete</mat-icon>
      </button>
    </ng-template>
  `,
})
export class DeleteEntityComponent implements OnInit {
  @Input() entity: any;
  @Input() label = 'Eliminar';
  @Input() title = 'Eliminado de registro';
  @Input() suffix = '';
  @Input() message = 'Seguro que desea eliminar el registro';
  @Input() inline = false;
  @Input() color = 'warn';
  @Output() delete = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onDelete() {
    this.dialogService
      .openConfirm({
        title: this.title,
        message: this.message,
        cancelButton: 'Cancelar',
        acceptButton: 'Aceptar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.delete.emit(this.entity);
        }
      });
  }
}
