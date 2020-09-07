import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { VentaCredito } from '@nx-papelsa/shared/utils/core-models';
import { ITdDataTableColumn } from '@covalent/core/data-table';

@Component({
  selector: 'nx-papelsa-revision-form-component',
  templateUrl: './revision-form.component.html',
  styleUrls: ['./revision-form.component.scss'],
})
export class RevisionFormComponent implements OnInit {
  form: FormGroup;
  facturas: VentaCredito[];
  cliente: any;

  dias = [
    { clave: 1, descripcion: 'Lunes (1)' },
    { clave: 2, descripcion: 'Martes (2)' },
    { clave: 3, descripcion: 'Miercoles (3)' },
    { clave: 4, descripcion: 'Jueves (4)' },
    { clave: 5, descripcion: 'Viernes (5)' },
    { clave: 6, descripcion: 'Sábado (6)' },
    { clave: 7, descripcion: 'Domingo (7)' },
  ];

  cobradores = [
    { id: '402880fc5e4ec411015e4ec6636b015a', nombre: 'DIRECTO', clave: '1' },
    {
      id: '402880fc5e4ec411015e4ec66505015d',
      nombre: 'JOSE ENRIQUE ESCALANTE MARTINEZ',
      clave: '4',
    },
    {
      id: '402880fc5e4ec411015e4ec66622015f',
      nombre: 'IVAN ESTRADA MAYA',
      clave: '6',
    },
    {
      id: '402880fc5e4ec411015e4ec666eb0161',
      nombre: 'CESAR ESCALANTE MAYA',
      clave: '8',
    },
    {
      id: '402880fc5e4ec411015e4ec667a80162',
      nombre: 'JOSE ANTONIO GRIJALVA JIMENEZ',
      clave: '9',
    },
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'cobrador.sw2', label: 'Cobr', width: 80 },
    { name: 'diaRevision', label: 'Dia Rev', width: 90 },
    { name: 'diaPago', label: 'Día Cob', width: 90 },
    { name: 'documento', label: 'Docto', width: 90 },
    { name: 'fecha', label: 'Fecha', width: 110 },
    { name: 'vencimiento', label: 'Vto', width: 120 },
    { name: 'saldo', label: 'Saldo', width: 120 },
    { name: 'plazo', label: 'Plazo' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RevisionFormComponent>,
    private fb: FormBuilder
  ) {
    this.facturas = data.facturas;
    this.cliente = this.facturas[0].nombre;
  }

  ngOnInit() {
    this.form = this.fb.group({
      diaRevision: ['', Validators.required],
      diaPago: ['', Validators.required],
      vencimientoFactura: [],
      plazo: ['', Validators.required],
      fechaRevision: [{ value: null, disabled: true }],
      cobrador: [null, Validators.required],
      comentario: [null],
      comentarioReprogramarPago: [null],
    });
    const first = this.facturas[0];
    this.form.patchValue(first);
  }

  compare(o1: any, o2: any) {
    console.log(`comprando ${o1} con ${o2}`);
    return o1.clave === o2.clave;
  }

  compareCobrador(o1: any, o2: any) {
    return o1.id === o2.id;
  }

  onSubmit() {
    if (this.form.valid) {
      const cobrador = this.form.get('cobrador').value
        ? { id: this.form.get('cobrador').value.id }
        : null;
      const update = { ...this.form.value, cobrador };
      this.dialogRef.close(update);
    }
  }
}
