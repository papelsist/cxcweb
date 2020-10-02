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
  Devolucion,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devolucion-form',
  templateUrl: './devolucion-form.component.html',
  styleUrls: ['./devolucion-form.component.scss'],
})
export class DevolucionFormComponent implements OnInit, OnDestroy {
  private _devolucion: Partial<NotaDeCredito>;
  @Output() update = new EventEmitter<Update<NotaDeCredito>>();
  private destroy$ = new Subject<boolean>();
  form: FormGroup;

  controls = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm(this.devolucion);
    if (this.devolucion.devolucion) {
    }
    if (
      this.devolucion.cfdi ||
      this.devolucion.cancelacion ||
      this.devolucion.autorizo ||
      this.devolucion.devolucion
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
    this.form = this.fb.group({
      concepto: [devolucion.concepto || 'DEVOLUCION', [Validators.required]],
      moneda: [
        { value: devolucion.moneda, disabled: true },
        [Validators.required],
      ],
      tc: [devolucion.tc, [Validators.required]],
      formaDePago: [
        { value: devolucion.formaDePago, disabled: true },
        [Validators.required],
      ],
      comentario: [devolucion.comentario, [Validators.maxLength(255)]],
      importe: [devolucion.importe, [Validators.required]],
      impuesto: [devolucion.impuesto, [Validators.required]],
      total: [devolucion.total, [Validators.required]],
      autorizo: [devolucion.autorizo],
      devolucion: [devolucion.devolucion, [Validators.required]],
    });
  }

  private addListeners() {}

  onSubmit() {
    if (this.form.valid) {
      const { comentario, devolucion } = this.form.value;
      const changes = { comentario, devolucion: { id: devolucion.id } };
      const dto = { id: this.devolucion.id, changes };
      this.update.emit(dto);
    }
  }

  setRmd(rmd: Partial<Devolucion>) {
    // console.log('Asignando RMD:', rmd);
    const { importe, impuesto, total, comentario } = rmd;
    const value = { importe, impuesto, total, comentario };
    this.form.patchValue(value, { emitEvent: false, onlySelf: true });
    this.getRmdControl().setValue(rmd);
    this.form.markAsDirty();
  }

  onSelectRmd(rmds: Devolucion[]) {
    const rmd = rmds[0];
    this.setRmd(rmd);
    this.form.markAsDirty();
  }

  get devolucion() {
    return this._devolucion;
  }

  getRmdControl() {
    return this.form.get('devolucion');
  }

  @Input()
  set devolucion(value: Partial<NotaDeCredito>) {
    this._devolucion = value;
    // console.log('NC Devolucion: ', this._devolucion);
    if (this.form) {
      if (value.devolucion) {
        this.setRmd(value.devolucion);
      }
      this.form.markAsPristine();
      if (
        this.devolucion.cfdi ||
        this.devolucion.cancelacion ||
        this.devolucion.autorizo ||
        this.devolucion.devolucion
      ) {
        this.form.disable();
      }
    }
  }

  get total() {
    return this.form.get('total').value;
  }

  faltaRmd() {
    return !this.devolucion.cfdi && !this.devolucion['rmd'];
  }

  isDirty() {
    return this.form.dirty;
  }
}
