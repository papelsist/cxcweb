import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { ClienteCredito } from '@nx-papelsa/shared/utils/core-models';
import { CreditoCardComponent } from '../credito-card/credito-card.component';

@Component({
  selector: 'nx-papelsa-credito-form',
  templateUrl: './credito-form.component.html',
})
export class CreditoFormComponent implements OnInit {
  credito: ClienteCredito;
  form: FormGroup;
  dias = [
    { clave: 1, descripcion: 'Lunes' },
    { clave: 2, descripcion: 'Martes' },
    { clave: 3, descripcion: 'Miercoles' },
    { clave: 4, descripcion: 'Jueves' },
    { clave: 5, descripcion: 'Viernes' },
    { clave: 6, descripcion: 'Sabado' },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialogRef<CreditoCardComponent, Update<ClienteCredito>>
  ) {
    this.credito = data.credito;
  }

  ngOnInit() {
    this.buildForm(this.credito);
    // console.log('Editando: ', this.credito);
  }

  private buildForm(credito: ClienteCredito) {
    this.form = this.fb.group({
      lineaDeCredito: [
        credito.lineaDeCredito,
        {
          validators: [Validators.required, Validators.min(0.0)],
          updateOn: 'blur',
        },
      ],
      saldo: [{ value: credito.saldo, disabled: true }],
      plazo: [
        credito.plazo,
        [Validators.required, Validators.min(0), Validators.max(90)],
      ],
      creditoActivo: [
        credito.creditoActivo,
        { vallidators: [Validators.required] },
      ],
      atrasoMaximo: [{ value: credito.atrasoMaximo, disabled: false }],
      postfechado: [credito.postfechado],
      descuentoFijo: [
        credito.descuentoFijo,
        [Validators.min(0), Validators.max(40)],
      ],
      revision: [credito.revision],
      venceFactura: [credito.venceFactura],
      diaRevision: [credito.diaRevision],
      diaCobro: [credito.diaCobro],
      usoDeCfdi: [credito.usoDeCfdi],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const update = {
        id: this.credito.id,
        changes: {
          ...this.form.value,
        },
      };
      this.dialog.close(update);
    }
  }
}
