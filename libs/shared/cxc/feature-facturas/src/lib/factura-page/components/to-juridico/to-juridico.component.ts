import { Component, OnInit, Inject } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CuentaPorCobrar,
  Juridico,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-tojuridico-dialog',
  templateUrl: './to-juridico.component.html',
})
export class ToJuridicoDialogComponent implements OnInit {
  form: FormGroup;
  factura: CuentaPorCobrar;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialoRef: MatDialogRef<ToJuridicoDialogComponent, Juridico>,
    private fb: FormBuilder
  ) {
    this.factura = data.factura;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      traspaso: [new Date()],
      despacho: [null, Validators.required],
      abogado: [null, Validators.required],
      comentario: [null],
    });
  }

  submit() {
    if (this.form.valid) {
      const traspaso: Date = this.form.get('traspaso').value;
      const despacho = { id: this.form.get('despacho').value };
      const { id, saldoReal, total, nombre } = this.factura;
      const entity = {
        ...this.form.value,
        traspaso: traspaso.toISOString(),
        despacho,
        saldo: saldoReal,
        importe: total,
        nombre,
        cxc: { id },
      };
      this.dialoRef.close(entity);
    }
  }
}
