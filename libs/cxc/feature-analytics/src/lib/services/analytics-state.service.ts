import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AnalyticsStateService {
  private _drawarState$ = new Subject<boolean>();
  isDrawerVisible$ = new Subject<boolean>();
  drawerState$ = this._drawarState$.asObservable();

  constructor() {}

  toogleDrawer(val: boolean) {
    this._drawarState$.next(val);
  }
}
