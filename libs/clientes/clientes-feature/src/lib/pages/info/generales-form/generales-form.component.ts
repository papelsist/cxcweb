import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';
import { GeneralesCardComponent } from '../generales-card/generales-card.component';

import { Update } from '@ngrx/entity';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';

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
    console.log('Cliente: ', this.cliente);
    this.buildForm(this.cliente);
  }

  private buildForm(cliente: Cliente) {
    this.form = new FormGroup({
      clave: new FormControl({ value: cliente.clave, disabled: true }),
      nombre: new FormControl(cliente.nombre, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
      razonSocial: new FormControl(cliente.razonSocial),
      regimenFiscal: new FormControl(cliente.regimenFiscal),
      rfc: new FormControl(cliente.rfc, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(13),
      ]),
      cfdiMail: new FormControl(cliente.cfdiMail, {
        validators: [Validators.required, Validators.email],
      }),
      activo: new FormControl(cliente.activo),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { cfdiMail } = this.form.value;
      let changes = {
        ...this.form.value,
        email: cfdiMail,
      };
      if (cfdiMail !== this.cliente.cfdiMail && this.cliente.medios) {
        const cfdiContact = this.cliente.medios.find(
          (item) => item.tipo === 'MAIL' && item.cfdi === true
        );
        if (cfdiContact) {
          const newMedio = { ...cfdiContact, descripcion: cfdiMail };
          const medios = {
            ...keyBy([...this.cliente.medios], 'id'),
            [cfdiContact.id]: newMedio,
          };
          changes = {
            ...changes,
            medios: values(medios),
          };
        }
      }
      const update: Update<Cliente> = { id: this.cliente.id, changes };
      this.dialog.close(update);
    }
  }
}
