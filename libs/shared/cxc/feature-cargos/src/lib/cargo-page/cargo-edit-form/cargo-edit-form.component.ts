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
    if (this.cargo.cfdi) this.form.disable();
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
            value:
              this.cargo.tipoDeCalculo === 'PRORRATEO' ? this.cargo.total : 0.0,
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
    if (!this.cargo.cfdi) {
      this.observarCargo();
      this.observarMonto();
      this.observarTipoDeCalculo();
      this.observarParaRecalculo();
    }
  }

  private observarCargo() {
    this.form
      .get('cargo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recalcular());
  }

  private observarMonto() {
    this.form
      .get('monto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recalcular());
  }

  private observarParaRecalculo() {
    this.form
      .get('importe')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.markAsDirty();
      });
  }

  private recalcular() {
    const tipo = this.form.get('tipoDeCalculo').value;
    switch (tipo) {
      case 'PORCENTAJE':
        this.service.calcularPorPorcentaje(this.form);
        break;
      case 'PRORRATEO':
        this.service.calcularPorProrrateo(this.form);
        break;
    }
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
    this.getCargoControl().setValue(0.0);
    this.getMontoControl().setValue(0.0);
    this.form.get('monto').disable();
    this.form.get('cargo').enable();
  }

  calculoProrrateo() {
    this.getCargoControl().setValue(0.0);
    this.getMontoControl().setValue(0.0);
    this.form.get('monto').enable();
    this.form.get('cargo').disable();
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

  onDeletePartida(rowData: { index: number; data: any }) {
    const control = this.getPartidas().removeAt(rowData.index);
    this.recalcular();
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
    }
  }

  get cargo() {
    return this._cargo;
  }

  get tipoDeCalculo() {
    return this.form.get('tipoDeCalculo').value;
  }
}
