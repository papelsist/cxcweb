import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cfdi-cancelar-dialog',
  template: `
    <div mat-dialog-title>
      Cancelación de CFDI
    </div>
    <mat-dialog-content>
      <mat-form-field [style.width.%]="100">
        <mat-label>Motivo:</mat-label>
        <input
          matInput
          placeholder="Digite el motivo de la cancelación"
          [formControl]="control"
        />
        <mat-error>Digite un motivo mínimo 10 caracteres</mat-error>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]>Cancelar</button>
      <button mat-button (click)="onSubmit()" [disabled]="control.invalid">
        <span>Aceptar</span>
      </button>
    </mat-dialog-actions>
  `,
})
export class CfdiCancelarDialogComponent implements OnInit {
  control: FormControl;
  constructor(
    private dialogRef: MatDialogRef<CfdiCancelarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.control = new FormControl(null, {
      validators: [Validators.required, Validators.minLength(10)],
      updateOn: 'change',
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }
}
