import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: 'cartera',
          loadChildren: () =>
            import('./features/cartera-cre/cartera-cre.module').then(
              (m) => m.CarteraCreModule
            ),
        },
        {
          path: '',
          redirectTo: 'cartera',
          pathMatch: 'full',
        },
      ],
      { initialNavigation: 'enabled' }
    ),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
