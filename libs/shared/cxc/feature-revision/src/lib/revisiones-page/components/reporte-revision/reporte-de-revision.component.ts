import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'nx-papelsa-reporte-de-revision',
  templateUrl: './reporte-de-revision.component.html',
  styles: [
    `
      .form-panel {
        min-width: 650px;
      }
    `,
  ],
})
export class ReporteDeRevisionComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReporteDeRevisionComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      cliente: [null],
      cobrador: [null],
    });
  }

  getReportCommand() {
    const fecha = this.form.get('fecha').value;
    const cliente = this.form.get('cliente').value;
    const cobrador = this.form.get('cobrador').value;

    const res = {
      fecha: fecha.toISOString(),
      cliente: cliente ? cliente.id : null,
      cobrador: cobrador ? cobrador.id : null,
    };
    return res;
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.getReportCommand());
    }
  }
}
