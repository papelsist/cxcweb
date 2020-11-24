import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import { Deposito } from '@nx-papelsa/shared/cxc/data-access-depositos';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cartera } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-deposito-create',
  templateUrl: './deposito-create.component.html',
  styleUrls: ['./deposito-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositoCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  posibleDuplicado: Deposito = null;
  // buscarDuplicado: SearchFn;

  carteras: Cartera[] = [
    { clave: 'CRE', descripcion: 'Crédito' },
    { clave: 'JUR', descripcion: 'Jurídico' },
    { clave: 'CHE', descripcion: 'Cheque' },
  ];
  constructor(
    private dialogRef: MatDialogRef<DepositoCreateComponent, Deposito>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}

  limitDate = new Date().toISOString();

  ngOnInit() {
    this.buildForm();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = new FormGroup({
      cliente: new FormControl(null, [Validators.required]),
      sucursal: new FormControl({ value: 'OFICINAS', enable: false }, [
        Validators.required,
      ]),
      cartera: new FormControl('CRE', {
        validators: [Validators.required],
      }),
      banco: new FormControl(null, [Validators.required]),
      cuenta: new FormControl(null, [Validators.required]),
      fecha: new FormControl(
        { value: new Date().toISOString(), disabled: true },
        [Validators.required]
      ),
      fechaDeposito: new FormControl(new Date().toISOString(), [
        Validators.required,
      ]),
      transferencia: new FormControl(true),
      total: new FormControl(0.0, [Validators.required, Validators.min(1.0)]),
      importes: new FormGroup({
        efectivo: new FormControl(0.0, [Validators.min(0.0)]),
        cheque: new FormControl(0.0, [Validators.min(0.0)]),
        tarjeta: new FormControl(0.0, [Validators.min(0.0)]),
      }),
      referencia: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.form.get('importes').disable();

    this.transfernciaListener();
    this.totalListener();
  }

  private transfernciaListener() {
    this.form
      .get('transferencia')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((trs) => {
        const ctrl: FormGroup = this.form.get('importes') as FormGroup;
        const totCtrl: FormGroup = this.form.get('total') as FormGroup;
        if (trs) {
          ctrl.disable();
          ctrl.setValue({ efectivo: 0.0, cheque: 0.0, tarjeta: 0.0 });
          totCtrl.enable();
        } else {
          ctrl.enable();
          totCtrl.disable();
        }
      });
  }

  private totalListener() {
    this.form
      .get('importes')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((imp) => {
        const { efectivo, cheque, tarjeta } = imp;
        const total = efectivo + cheque + tarjeta;
        this.form.get('total').setValue(total);
      });
  }

  submit() {
    if (this.form.valid) {
      const d: Deposito = this.buildDeposito();
      d.lastUpdated = new Date().toISOString();
      // this.dialogRef.close(d);
    }
  }

  buildDeposito(): Deposito {
    const data: any = this.form.getRawValue();
    const { cliente, cuenta, pedido, fechaDeposito } = data;
    const deposito = { ...data };
    deposito.nombre = cliente.nombre;
    deposito.fechaDeposito =
      typeof fechaDeposito === 'string'
        ? fechaDeposito
        : fechaDeposito.toISOString();
    deposito.cliente = {
      id: cliente.id,
      nombre: cliente.nombre,
      rfc: cliente.rfc,
    };
    deposito.rfc = cliente.rfc;
    deposito.cerrado = false;
    deposito.cuenta = {
      id: cuenta.id,
      descripcion: cuenta.descripcion,
      numero: cuenta.numero,
    };
    if (pedido) {
      deposito.pedido = {
        id: pedido.id,
        folio: pedido.folio,
        fecha: pedido.fecha,
        total: pedido.total,
        formaDePago: pedido.formaDePago,
      };
    }
    return deposito;
  }

  get tipo() {
    return this.isTransferencia() ? 'Transferencia' : 'Depósito';
  }

  isTransferencia() {
    return this.form.get('transferencia').value;
  }
}
