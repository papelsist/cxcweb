import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Antiguedad } from '../antiguedad-page/antiguedad-models';

@Injectable()
export class AntiguedadStateService {
  _current$ = new BehaviorSubject<Antiguedad>(null);
  current$ = this._current$.asObservable();

  constructor() {}

  setCurrent(a: Antiguedad) {
    this._current$.next(a);
  }
}
