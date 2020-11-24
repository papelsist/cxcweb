import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { AppStoreModule } from './+store/app-store.module';

// Firebase AngularFire
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppStoreModule,
    AppRoutingModule,
    CoreModule,
    // Firebase
    AngularFireModule.initializeApp(environment.firebase, 'swrx-callcenter'),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [{ provide: 'apiUrl', useValue: environment.apiUrl }],
  bootstrap: [AppComponent],
})
export class AppModule {}
