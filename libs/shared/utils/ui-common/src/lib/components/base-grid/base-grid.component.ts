import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

@Component({
  selector: 'nx-papelsa-base-grid',
  template: ``,
})
export class BaseGridComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit() {}

  formatCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }
}
