import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { AppStoreModule } from './+store/app-store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppStoreModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [{ provide: 'apiUrl', useValue: environment.apiUrl }],
  bootstrap: [AppComponent],
})
export class AppModule {}
