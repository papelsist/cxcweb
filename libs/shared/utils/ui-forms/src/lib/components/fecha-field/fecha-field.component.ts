import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'nx-papelsa-fecha-field',
  template: `<mat-form-field class="fecha-field">
    <mat-label>{{ label }}</mat-label>
    <input
      matInput
      [matDatepicker]="fechaDP"
      [min]="minDate"
      [max]="maxDate"
      (dateChange)="onDateChanged($event)"
      [value]="_value"
      [disabled]="disabled"
      [placeholder]="placeholder"
      autocomplete="off"
    />
    <mat-error>Fecha invalida</mat-error>
    <mat-datepicker-toggle
      matSuffix
      [for]="fechaDP"
      [disabled]="disabled"
    ></mat-datepicker-toggle>
    <mat-datepicker #fechaDP></mat-datepicker>
  </mat-form-field>`,
  styles: [
    `
      .fecha-field {
        width: 100%;
      }
    `,
  ],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FechaFieldComponent),
      multi: true,
    },
  ],
})
export class FechaFieldComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'Fecha';
  @Input() placeholder = 'Fecha';
  _value: any = new Date().toISOString();
  disabled = false;
  @Input() minDate: any;
  @Input() maxDate: any;

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit() {}

  onDateChanged(event: any) {
    if (!this.disabled) {
      const dt = moment(event.value).toISOString();
      console.log('Selected: ', dt);
      this._value = event.value;
      this.onChanged(this._value);
      this.onTouched();
    }
  }

  /** ControlValueAccessor Implementation */
  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
