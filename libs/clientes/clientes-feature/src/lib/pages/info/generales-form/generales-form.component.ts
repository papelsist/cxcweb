import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';
import { GeneralesCardComponent } from '../generales-card/generales-card.component';

import { Update } from '@ngrx/entity';

@Component({
  selector: 'nx-papelsa-generales-form',
  templateUrl: './generales-form.component.html',
  styleUrls: ['./generales-form.component.scss'],
})
export class GeneralesFormComponent implements OnInit {
  cliente: Cliente;
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialogRef<GeneralesCardComponent, Update<Cliente>>
  ) {
    this.cliente = data.cliente;
  }

  ngOnInit() {
    this.buildForm(this.cliente);
  }

  private buildForm(cliente: Cliente) {
    this.form = new FormGroup({
      clave: new FormControl({ value: cliente.clave, disabled: true }),
      rfc: new FormControl(cliente.rfc, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(13),
      ]),
      activo: new FormControl(cliente.activo),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const changes = {
        ...this.form.value,
      };
      const update: Update<Cliente> = { id: this.cliente.id, changes };
      this.dialog.close(update);
    }
  }
}
