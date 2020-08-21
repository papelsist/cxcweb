import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { Update } from '@ngrx/entity';

import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  NotaDeCredito,
  CuentaPorCobrarDTO,
  NotaDeCreditoDet,
  buildNotaDetFromFactura,
} from '@nx-papelsa/shared/utils/core-models';

import { sumByProperty } from '@nx-papelsa/shared/utils/collections';
import { DevolucionFormService } from './devolucion-form.service';

@Component({
  selector: 'nx-papelsa-devolucion-form',
  templateUrl: './devolucion-form.component.html',
  styleUrls: ['./devolucion-form.component.scss'],
  providers: [DevolucionFormService],
})
export class DevolucionFormComponent implements OnInit, OnDestroy {
  private _devolucion: Partial<NotaDeCredito>;
  @Output() update = new EventEmitter<Update<NotaDeCredito>>();
  private destroy$ = new Subject<boolean>();
  form: FormGroup;

  controls = {};

  constructor(
    private fb: FormBuilder,
    private service: DevolucionFormService
  ) {}

  ngOnInit() {
    this.buildForm(this.devolucion);
    if (
      this.devolucion.cfdi ||
      this.devolucion.cancelacion ||
      this.devolucion.autorizo
    ) {
      this.form.disable();
    }
    this.addListeners();
  }

  ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  buildForm(devolucion: Partial<NotaDeCredito>) {
    this.form = this.fb.group(
      {
        concepto: [devolucion.concepto, [Validators.required]],
        moneda: [devolucion.moneda, [Validators.required]],
        tc: [devolucion.tc, [Validators.required]],
        formaDePago: [devolucion.formaDePago, Validators.required],
        tipoDeCalculo: [devolucion.tipoDeCalculo, Validators.required],
        baseDelCalculo: [devolucion.baseDelCalculo, [Validators.required]],
        descuento: [
          devolucion.descuento,
          [Validators.required, Validators.min(0.0), Validators.max(50)],
        ],
        descuento2: [
          devolucion.descuento2,
          [Validators.required, Validators.min(0.0), Validators.max(50)],
        ],
        monto: [devolucion.total, [Validators.min(0.0)]],
        comentario: [devolucion.comentario, [Validators.maxLength(255)]],
        partidas: this.fb.array(
          devolucion.partidas.map((item) => new FormControl(item))
        ),
        importe: [devolucion.importe, Validators.required],
        impuesto: [devolucion.impuesto, Validators.required],
        total: [devolucion.total, Validators.required],
        autorizo: [devolucion.autorizo],
      },
      { updateOn: 'blur', validators: this.validar.bind(this) }
    );
  }

  private addListeners() {
    merge(
      this.form.get('descuento').valueChanges,
      this.form.get('descuento2').valueChanges,
      this.form.get('baseDelCalculo').valueChanges,
      this.form.get('monto').valueChanges
    )
      .pipe(
        tap((val) => console.log('ValueChange: ', val)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.actualizar());

    this.form
      .get('tipoDeCalculo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.actualizar());
  }

  validar() {
    if (
      this.form &&
      this.getPartidas() &&
      this.getPartidas().length > 0 &&
      this.form.get('total').value <= 0.0
    ) {
      return { importeInvalido: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      const changes = this.form.getRawValue();
      const dto = { id: this.devolucion.id, changes };
      this.update.emit(dto);
    }
  }

  isDirty() {
    return this.form.dirty;
  }

  getPartidas(): FormArray {
    return this.form.get('partidas') as FormArray;
  }

  onAgregarFacturas(facturas: CuentaPorCobrarDTO[]) {
    const items: NotaDeCreditoDet[] = facturas.map((item) => {
      return {
        ...buildNotaDetFromFactura(item),
      };
    });
    this.addPartidas(items);
  }

  private addPartidas(items: NotaDeCreditoDet[]) {
    items
      .map((item) => new FormControl(item))
      .forEach((control) => {
        console.log('Agregando partida: ', control.value);
        this.getPartidas().push(control);
      });
    this.actualizar();
  }

  onDeletePartida({ index }) {
    console.log('Delete: ', index);
    this.getPartidas().removeAt(index);
    this.actualizar();
  }

  onEditPartida({ index }) {
    console.log('Editando: ', index);
  }

  /**
   * Actualizar los importes de la bonificación en función de las reglas vigentes
   *
   */
  actualizar() {
    const tipo = this.tipoDeCalculo;
    if (tipo === 'PORCENTAJE') {
      this.service.calcularPorPorcentaje(this.form); //actualizarPorPorcentaje();
      this.form.get('monto').setValue(0.0, { emitEvent: false });
    } else if (tipo === 'PRORRATEO') {
      this.form.get('descuento').setValue(0.0, { emitEvent: false });
      this.form.get('descuento2').setValue(0.0, { emitEvent: false });
      this.service.calcularPorProrrateo(this.form);
    }
    this.actualizarTotales();
    this.form.markAsDirty();
  }

  actualizarTotales() {
    const data = this.getPartidas().value;
    const importe = sumByProperty(data, 'importe');
    const impuesto = sumByProperty(data, 'impuesto');
    const total = sumByProperty(data, 'total');
    this.form.patchValue({ importe, impuesto, total });
  }

  get devolucion() {
    return this._devolucion;
  }

  @Input()
  set devolucion(value: Partial<NotaDeCredito>) {
    this._devolucion = value;
    console.log('Bonificaion: ', this._devolucion);
    if (this.form) {
      this.form.markAsPristine();
      if (this.devolucion.cfdi || this.devolucion.cancelacion) {
        this.form.disable({ emitEvent: false });
      }
    }
  }

  get tipoDeCalculo() {
    return this.form.get('tipoDeCalculo').value;
  }

  get manual() {
    return this.tipoDeCalculo === 'MANUAL';
  }
  get total() {
    return this.form.get('total').value;
  }
}
