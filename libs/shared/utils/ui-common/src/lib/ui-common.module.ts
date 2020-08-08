import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
// Date Picker suppor
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';

import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import {
  UI_COMMONS_COMPONENTS,
  UI_COMMONS_ENTRY_COMPONENTS,
} from './components';
import { FormatService } from './format.service';

const COMMON_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  FormsModule,
  UiMaterialModule,
  // MatMomentDateModule,
];

@NgModule({
  declarations: [...UI_COMMONS_COMPONENTS],
  imports: [...COMMON_MODULES],
  exports: [...COMMON_MODULES, ...UI_COMMONS_COMPONENTS],
  entryComponents: [...UI_COMMONS_ENTRY_COMPONENTS],
})
export class UiCommonModule {
  /**
   * To be used in the CoreModule or AppModule of an app to supplay all singleton providers
   *
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootUiCommonModule,
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        FormatService,
        // {
        //   provide: DateAdapter,
        //   useClass: MomentDateAdapter,
        //   deps: [MAT_DATE_LOCALE],
        // },
        // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      ],
    };
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})
export class RootUiCommonModule {
  constructor(@Optional() @SkipSelf() parentModule?: RootUiCommonModule) {
    if (parentModule) {
      throw new Error(
        'RootUiCommonModule is already loaded. Import it in the AppModule/CoreModule only'
      );
    }
  }
}
