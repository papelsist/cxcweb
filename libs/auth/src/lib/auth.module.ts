import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';
import { AuthFacade } from './+state/auth.facade';

import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token.interceptor';
import { UnautorizedInterceptor } from './services/unauthorized.interceptor';
import { AuthGuard } from './services/auth.guard';

import { throwIfAlreadyLoaded } from '@nx-papelsa/shared/utils/core-models';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/login/login.page.module').then(
            (m) => m.LoginPageModule
          ),
      },
    ]),
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthService,
    AuthFacade,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnautorizedInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AuthModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'AuthModule');
  }
}
