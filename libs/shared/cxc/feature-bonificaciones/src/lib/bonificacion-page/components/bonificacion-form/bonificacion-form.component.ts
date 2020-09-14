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

import {
  MonedaUtils,
  sumByProperty,
  aplicarDescuentos,
} from '@nx-papelsa/shared/utils/collections';
import { BonificacionFormService } from './bonificacion-form.service';

@Component({
  selector: 'nx-papelsa-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
  providers: [BonificacionFormService],
})
export class BonificacionFormComponent implements OnInit, OnDestroy {
  private _bonificacion: Partial<NotaDeCredito>;
  @Output() update = new EventEmitter<Update<NotaDeCredito>>();
  private destroy$ = new Subject<boolean>();
  form: FormGroup;

  controls = {};

  constructor(
    private fb: FormBuilder,
    private service: BonificacionFormService
  ) {}

  ngOnInit() {
    this.buildForm(this.bonificacion);
    if (
      this.bonificacion.cfdi ||
      this.bonificacion.cancelacion ||
      this.bonificacion.autorizacion ||
      this.bonificacion.solicitud
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

  buildForm(bonificacion: Partial<NotaDeCredito>) {
    this.form = this.fb.group(
      {
        concepto: [bonificacion.concepto, [Validators.required]],
        moneda: [bonificacion.moneda, [Validators.required]],
        tc: [bonificacion.tc, [Validators.required]],
        formaDePago: [bonificacion.formaDePago, Validators.required],
        tipoDeCalculo: [bonificacion.tipoDeCalculo, Validators.required],
        baseDelCalculo: [bonificacion.baseDelCalculo, [Validators.required]],
        descuento: [
          bonificacion.descuento,
          [Validators.required, Validators.min(0.0), Validators.max(50)],
        ],
        descuento2: [
          bonificacion.descuento2,
          [Validators.required, Validators.min(0.0), Validators.max(50)],
        ],
        monto: [bonificacion.total, [Validators.min(0.0)]],
        comentario: [bonificacion.comentario, [Validators.maxLength(255)]],
        partidas: this.fb.array(
          bonificacion.partidas.map((item) => new FormControl(item))
        ),
        importe: [bonificacion.importe, Validators.required],
        impuesto: [bonificacion.impuesto, Validators.required],
        total: [bonificacion.total, Validators.required],
        autorizo: [bonificacion.autorizo],
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
        // tap((val) => console.log('ValueChange: ', val)),
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

  get bonificacion() {
    return this._bonificacion;
  }

  @Input()
  set bonificacion(value: Partial<NotaDeCredito>) {
    this._bonificacion = value;
    console.log('Bonificaion: ', this._bonificacion);
    if (this.form) {
      this.form.markAsPristine();
      if (this.bonificacion.cfdi || this.bonificacion.cancelacion) {
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
