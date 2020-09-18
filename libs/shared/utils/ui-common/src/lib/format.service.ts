import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, formatDate, formatPercent } from '@angular/common';
import * as moment from 'moment';

export const AgGridText = {
  // Set Filter
  selectAll: 'Seleccionar todos',
  selectAllSearchResults: 'Seleccionar todos resultado',
  searchOoo: 'Buscando...',
  blanks: 'Blanks',
  noMatches: 'No matches.',

  page: 'página',
  more: 'mas',
  to: 'a',
  of: 'de',
  next: 'siguiente',
  last: 'ultimo',
  first: 'primero',
  previous: 'anterior',
  loadingOoo: 'cargando registros',
  // Date Filter
  dateFormatOoo: 'Yyyy-mm-dd',

  // Filter Conditions
  andCondition: 'Y',
  orCondition: 'O',
  // Filter Buttons
  applyFilter: 'Aplicar',
  resetFilter: 'Regresar',
  clearFilter: 'Limpiar',
  cancelFilter: 'Cancelar',

  equals: 'Igual a',
  notEqual: 'diferente a',
  lessThan: 'menor que',
  greaterThan: 'mayor que',
  lessThanOrEqual: 'menor o igual',
  greaterThanOrEqual: 'mayor o igual',
  inRange: 'rango',
  contains: 'contiene',
  notContains: 'no contiene',
  startsWith: 'inicia con',
  endsWith: 'termina con',
  filters: 'filtros',
};

export function agDateComparator(filterLocalDateAtMidnight, cellValue) {
  const cellDate = moment(cellValue).toDate();
  if (cellDate < filterLocalDateAtMidnight) {
    return -1;
  } else if (cellDate > filterLocalDateAtMidnight) {
    return 1;
  } else {
    return 0;
  }
}

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

  formatPercent(value: any, format: string = '1.2-2') {
    if (value) {
      return formatPercent(value, this.locale, format);
    } else {
      return '';
    }
  }

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
