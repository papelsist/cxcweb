import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthFacade } from '@nx-papelsa/auth';
import { MainNavigation } from './navigation';

@Component({
  selector: 'nx-papelsa-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener;
  mainNavigation = MainNavigation;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AuthFacade
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.auth.fetchUserInfo();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
