import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'nx-papelsa-tel-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Teléfono" [formControl]="control" />
        <!-- <input matInput placeholder="Teléfono" [(ngModel)]="telefono" mask="(009) 000-00-00"/> -->
        <mat-error>
          Número inválido
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
export class TelefonoDialogComponent implements OnInit {
  telefono;
  title = '';
  subtitle: string;
  control: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.telefono = data.telefono;
    this.control = new FormControl(this.telefono, [
      Validators.required,
      //Validators.pattern(
      //'(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
      //),
    ]);
  }

  ngOnInit() {}
}
