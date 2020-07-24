import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

import { Update } from '@ngrx/entity';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
})
export class BonificacionFormComponent implements OnInit {
  @Input() bonificacion: Partial<NotaDeCredito>;
  @Output() update = new EventEmitter<Update<NotaDeCredito>>();
  form: FormGroup;

  controls = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm(this.bonificacion);
  }

  buildForm(bonificacion: Partial<NotaDeCredito>) {
    this.form = this.fb.group({});
  }

  onSubmit() {}

  isDirty() {
    return this.form.dirty;
  }
}
