import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import {
  Deposito,
  SolicitudDeDeposito,
} from '@nx-papelsa/shared/cxc/data-access-depositos';
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
  deposito: SolicitudDeDeposito;
  readonly = false;
  constructor(
    private dialogRef: MatDialogRef<DepositoCreateComponent, Deposito>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  // limitDate = new Date().toISOString();

  ngOnInit() {
    this.buildForm();
    if (this.data.deposito) {
      this.deposito = this.data.deposito;
      if (!this.deposito.rechazo) {
        this.readonly = true;
        this.form.patchValue(this.data.deposito, { emitEvent: false });
        this.form.disable();
      }
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      cliente: [null, [Validators.required]],
      cartera: ['CRE', [Validators.required]],
      banco: [null, [Validators.required]],
      cuenta: [null, [Validators.required]],
      fechaDeposito: [new Date().toISOString(), [Validators.required]],
      transferencia: [0.0, [Validators.required, Validators.min(0.0)]],
      total: [
        { value: 0.0, disabled: false },
        [Validators.required, Validators.min(1.0)],
      ],
      efectivo: [0.0, [Validators.min(0.0)]],
      cheque: [0.0, [Validators.min(0.0)]],
      tarjeta: [0.0, [Validators.min(0.0)]],
      referencia: [
        null,
        {
          validators: [Validators.required],
        },
      ],
    });
    this.transfernciaListener();
    this.importesListener();
  }

  private transfernciaListener() {
    this.form
      .get('transferencia')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((trs) => {
        if (trs > 0.0) {
          const imp = { efectivo: 0.0, tarjeta: 0.0, cheque: 0.0 };
          this.form.patchValue(imp, { onlySelf: true, emitEvent: false });
          this.cd.markForCheck();
          this.actualizarTotal();
        }
      });
  }

  private importesListener() {
    const ef$ = this.form
      .get('efectivo')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const che$ = this.form
      .get('cheque')
      .valueChanges.pipe(takeUntil(this.destroy$));
    const tar$ = this.form
      .get('tarjeta')
      .valueChanges.pipe(takeUntil(this.destroy$));

    merge(ef$, che$, tar$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form
          .get('transferencia')
          .patchValue(0.0, { onlySelf: true, emitEvent: false });
        this.actualizarTotal();
      });
  }

  private actualizarTotal() {
    console.log('Actualizando totales');
    const transferencia = this.form.get('transferencia').value || 0.0;
    const efectico = this.form.get('efectivo').value || 0.0;
    const cheque = this.form.get('cheque').value || 0.0;
    const tarjeta = this.form.get('tarjeta').value || 0.0;
    const total = transferencia + cheque + efectico + tarjeta;

    this.form.get('total').setValue(total);
    this.cd.markForCheck();
  }

  submit() {
    if (this.form.valid) {
      const d: Deposito = this.buildDeposito();
      d.lastUpdated = new Date().toISOString();
      const solicitud = {
        ...d,
        cliente: { id: d.cliente.id },
        cuenta: { id: d.cuenta.id },
        banco: { id: d.banco.id },
      };
      this.dialogRef.close(d);
    }
  }

  buildDeposito(): Deposito {
    const data: any = this.form.getRawValue();
    const { cliente, cuenta, pedido, fechaDeposito, banco } = data;
    const deposito = { ...data };
    deposito.fechaDeposito =
      typeof fechaDeposito === 'string'
        ? fechaDeposito
        : fechaDeposito.toISOString();
    deposito.cliente = {
      id: cliente.id,
    };
    deposito.cuenta = {
      id: cuenta.id,
    };
    deposito.banco = {
      id: banco.id,
    };
    deposito.tipo = data.cartera;
    return deposito;
  }

  get tipo() {
    return this.isTransferencia() ? 'Transferencia' : 'Depósito';
  }

  isTransferencia() {
    return this.form.get('transferencia').value > 0.0;
  }
}
