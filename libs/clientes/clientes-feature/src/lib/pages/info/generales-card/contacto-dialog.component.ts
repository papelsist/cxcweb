import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteContacto } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-contacto-dialog',
  template: `
    <div [formGroup]="form">
      <h3 mat-dialog-title>
        {{ target ? 'Contacto' : 'Alta de contacto' }}
      </h3>
      <mat-divider></mat-divider>
      <div fxLayout="column" fxLayoutGap="5px">
        <nx-papelsa-upper-case-field
          placeholder="Nombre"
          formControlName="nombre"
        ></nx-papelsa-upper-case-field>
        <nx-papelsa-upper-case-field
          formControlName="puesto"
          placeholder="Puesto"
        ></nx-papelsa-upper-case-field>

        <mat-form-field>
          <mat-label>Teléfono</mat-label>
          <input matInput type="tel" formControlName="telefono" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
      </div>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>
          <mat-icon>cancel</mat-icon>
          <mat-label>Cancelar</mat-label>
        </button>
        <button
          mat-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="form.invalid || form.pristine"
        >
          <mat-icon>save</mat-icon>
          <mat-label>Salvar</mat-label>
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ContactoDialogComponent implements OnInit {
  form: FormGroup;
  target: ClienteContacto;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialotRef: MatDialogRef<ContactoDialogComponent>,
    private fb: FormBuilder
  ) {
    this.target = data.contacto;
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
        ],
      ],
      puesto: [null, [Validators.required]],
      email: [null, [Validators.email]],
      telefono: [null],
    });
    if (this.target) {
      this.form.patchValue(this.target);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const value = {
        ...this.form.value,
      };
      if (this.target) value.id = this.target.id;
      this.dialotRef.close(value);
    }
  }
}
