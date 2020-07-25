import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';

import { Update } from '@ngrx/entity';

import {
  NotaDeCredito,
  CuentaPorCobrarDTO,
  NotaDeCreditoDet,
  buildNotaDetFromFactura,
} from '@nx-papelsa/shared/utils/core-models';
import { BonificacionFormService } from './bonificacion-form.service';

@Component({
  selector: 'nx-papelsa-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
  providers: [BonificacionFormService],
})
export class BonificacionFormComponent implements OnInit {
  @Input() bonificacion: Partial<NotaDeCredito>;
  @Output() update = new EventEmitter<Update<NotaDeCredito>>();
  form: FormGroup;

  controls = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('Editando: ', this.bonificacion);
    this.buildForm(this.bonificacion);
  }

  buildForm(bonificacion: Partial<NotaDeCredito>) {
    this.form = this.fb.group({
      concepto: [bonificacion.concepto, [Validators.required]],
      moneda: [bonificacion.moneda, [Validators.required]],
      tc: [bonificacion.tc, [Validators.required]],
      formaDePago: [bonificacion.formaDePago, Validators.required],
      tipoDeCalculo: [bonificacion.tipoDeCalculo, Validators.required],
      baseDelCalculo: [bonificacion.baseDelCalculo, [Validators.required]],
      descuento: [
        0.0,
        [Validators.required, Validators.min(0.0), Validators.max(50)],
      ],
      descuento2: [
        bonificacion.descuento2,
        [Validators.required, Validators.min(0.0), Validators.max(50)],
      ],
      comentario: [bonificacion.comentario, [Validators.maxLength(255)]],
      partidas: this.fb.array(
        bonificacion.partidas.map((item) => new FormControl(item))
      ),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const changes = this.form.getRawValue();
      const dto = { id: this.bonificacion.id, changes };
      this.update.emit(dto);
    }
  }

  isDirty() {
    return this.form.dirty;
  }

  getPartidas(): FormArray {
    return this.form.get('partidas') as FormArray;
  }

  private addPartidas(items: NotaDeCreditoDet[]) {
    items
      .map((item) => new FormControl(item))
      .forEach((control) => this.getPartidas().push(control));
    this.form.markAsDirty();
  }

  onAgregarFacturas(facturas: CuentaPorCobrarDTO[]) {
    const items: NotaDeCreditoDet[] = facturas.map((item) => {
      return {
        ...buildNotaDetFromFactura(item),
      };
    });
    this.addPartidas(items);
  }
}
