import { OnDestroy } from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

// libs
import { Subject } from 'rxjs';

export abstract class BaseComponent implements OnDestroy {
  private _destroy$: Subject<any>;

  get destroy$() {
    if (!this._destroy$) {
      // Perf optimization:
      // since this is likely used as base component everywhere
      // only construct a Subject instance if actually used
      this._destroy$ = new Subject();
    }
    return this._destroy$;
  }
  ngOnDestroy() {
    if (this._destroy$) {
      this._destroy$.next(true);
      this._destroy$.complete();
    }
  }

  formatCurrency(data: any) {
    return formatCurrency(data, 'es-MX', '$');
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, 'es-MX');
    } else {
      return '';
    }
  }

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
