import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Direccion } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-direccion-dialog',
  template: `
    <div mat-dialog-title>
      Actualizar domicilio
    </div>
    <mat-dialog-content>
      <nx-papelsa-direccion-form [direccion]="direccion" #form>
      </nx-papelsa-direccion-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button mat-dialog-close>
        Cancelar
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit(form.form.value)"
        [disabled]="form.form.invalid && form.form.pristine"
      >
        <mat-icon>edit_location</mat-icon>
        <span>Actualizar</span>
      </button>
    </mat-dialog-actions>
  `,
})
export class DireccionDialogComponent implements OnInit {
  // form: FormGroup;
  direccion: Direccion;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DireccionDialogComponent, Direccion>
  ) {
    this.direccion = this.data.direccion || {};
  }

  ngOnInit() {}

  onSubmit(value: Direccion) {
    this.dialogRef.close(value);
    // if (this.form.valid) {
    //   const res: Direccion = {
    //     ...this.form.value,
    //   };
    //   this.dialogRef.close(res);
    // }
  }
}
