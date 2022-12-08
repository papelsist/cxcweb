import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'nx-papelsa-email-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input
          matInput
          placeholder="Email"
          [formControl]="control"
          type="email"
        />
        <mat-error>
          Email inválido
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-button
        [mat-dialog-close]="control.value"
        [disabled]="control.invalid || control.pristine"
      >
        Aceptar
      </button>
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
})
export class CorreoDialogComponent implements OnInit {
  email;
  title = '';
  subtitle: string;
  control: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.email = data.email;
    this.control = new FormControl(this.email, [
      Validators.required,
      Validators.email,
    ]);
  }

  ngOnInit() {}
}
