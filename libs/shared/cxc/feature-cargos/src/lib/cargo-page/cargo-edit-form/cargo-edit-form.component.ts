import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  NotaDeCargo,
  NotaDeCargoDet,
  CuentaPorCobrarDTO,
  buildFromFactura,
} from '@nx-papelsa/shared/utils/core-models';

import {
  sumByProperty,
  MonedaUtils,
} from '@nx-papelsa/shared/utils/collections';

import { CargoFormService } from './cargo-form.service';

@Component({
  selector: 'nx-papelsa-cxc-cargo-edit-form',
  templateUrl: './cargo-edit-form.component.html',
  styleUrls: ['./cargo-edit-form.component.scss'],
  providers: [CargoFormService],
})
export class CargoEditFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject<boolean>();

  _cargo: NotaDeCargo;

  @Output() update = new EventEmitter<{
    id: string;
    changes: Partial<NotaDeCargo>;
  }>();

  constructor(private fb: FormBuilder, private service: CargoFormService) {}

  ngOnInit(): void {
    this.buildForm();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        tipoDeCalculo: [this.cargo.tipoDeCalculo, [Validators.required]],
        cargo: [
          this.cargo.cargo,
          [Validators.required, Validators.min(0), Validators.max(50)],
        ],
        monto: [
          {
            value: this.cargo.total,
            disabled: this.cargo.tipoDeCalculo === 'PORCENTAJE',
          },
          [Validators.required],
        ],
        importe: [this.cargo.importe, [Validators.required, Validators.min(1)]],
        impuesto: [this.cargo.impuesto, [Validators.required]],
        total: [this.cargo.total, [Validators.required]],
        formaDePago: [this.cargo.formaDePago, [Validators.required]],
        usoDeCfdi: [this.cargo.usoDeCfdi, [Validators.required]],
        moneda: [this.cargo.moneda, [Validators.required]],
        tipoDeCambio: [this.cargo.tipoDeCambio, [Validators.required]],
        comentario: [this.cargo.comentario],
        partidas: this.fb.array(
          this._cargo.partidas.map((item) => new FormControl(item))
        ),
      },
      { updateOn: 'blur' }
    );
    this.observarCargo();
    this.observarMonto();
    this.observarTipoDeCalculo();
  }

  private observarCargo() {
    this.form
      .get('cargo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.actualizarPorPorcentaje());
  }

  private observarMonto() {
    this.form
      .get('monto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.service.calcularPorProrrateo(this.form));
  }

  private observarTipoDeCalculo() {
    this.form
      .get('tipoDeCalculo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((tipo: string) => {
        switch (tipo) {
          case 'PORCENTAJE':
            this.calculoPorcentual();
            break;
          case 'PRORRATEO':
            this.calculoProrrateo();
            break;
        }
      });
  }

  calculoPorcentual() {
    this.form.get('monto').disable();
    this.form.get('cargo').enable();
  }

  calculoProrrateo() {
    this.getCargoControl().setValue(0.0);
    this.getMontoControl().setValue(0.0);
    this.form.get('monto').enable();
    this.form.get('cargo').disable();
  }

  private actualizarPorPorcentaje() {
    const cargo = this.getCargoControl().value / 100;
    const sobreSaldo = true; // Fixed
    console.log('Actualizando por porcentaje: ', cargo);

    const items: FormArray = this.getPartidas();

    let acuImporte = 0.0,
      acuImpuesto = 0.0,
      acuTotal = 0.0;

    for (let index = 0; index < items.length; index++) {
      const control = items.at(index);
      const det: Partial<NotaDeCargoDet> = control.value;
      det.cargo = cargo;
      const monto = sobreSaldo ? det.documentoSaldo : det.documentoTotal;
      const total = MonedaUtils.round(monto * cargo);
      const importe = MonedaUtils.calcularImporteDelTotal(total);
      const impuesto = MonedaUtils.calcularImpuesto(importe);
      det.total = total;
      det.importe = importe;
      det.impuesto = impuesto;
      console.log('Partida actualizada: ', det);
      items.setControl(index, new FormControl(det));
      acuImporte += importe;
      acuImpuesto += impuesto;
      acuTotal += total;
    }

    this.form.patchValue({
      importe: acuImporte,
      impuesto: acuImpuesto,
      total: acuTotal,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const partidas = this.getPartidas().value;
      const res = { id: this.cargo.id, changes: { ...value }, partidas };
      this.update.emit(res);
    }
  }

  getPartidas(): FormArray {
    return this.form.get('partidas') as FormArray;
  }

  onAgregarFacturas(facturas: CuentaPorCobrarDTO[]) {
    const items: NotaDeCargoDet[] = facturas.map((item) => {
      const cargo = this.getCargoControl().value;
      return {
        ...buildFromFactura(item),
        cargo,
      };
    });

    this.addPartidas(items);
  }

  private addPartidas(items: NotaDeCargoDet[]) {
    items
      .map((item) => new FormControl(item))
      .forEach((control) => this.getPartidas().push(control));
  }

  getCargoControl() {
    return this.form.get('cargo');
  }
  getMontoControl() {
    return this.form.get('monto');
  }

  @Input()
  set cargo(value: NotaDeCargo) {
    this._cargo = value;
    console.log('Nota de Cargo: ', this._cargo);
    if (this.form) {
      this.getPartidas().clear();
      this.addPartidas(this._cargo.partidas);
    } else {
      console.log('Creación de forma...');
    }
  }

  get cargo() {
    return this._cargo;
  }

  get tipoDeCalculo() {
    return this.form.get('tipoDeCalculo').value;
  }
}
