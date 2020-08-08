import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

@Injectable()
export class FormatService {
  constructor(@Inject(LOCALE_ID) private locale) {}

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
