import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';

import { CfdiXmlComponent } from './cfdi-xml/cfdi-xml.component';
import { CfdiPdfComponent } from './cfdi-pdf/cfdi-pdf.component';
import { CfdiTimbrarComponent } from './cfdi-timbrar/cfdi-timbrar.component';
import { CfdiEmailComponent } from './cfdi-email/cfdi-email.component';
import { CfdiCancelarComponent } from './cfdi-cancelar/cfdi-cancelar.component';

import { CFDI_COMPONENTS, CFDI_ENTRY_COMPONENTS } from './components';
import { CfdiEmailBulkComponent } from './cfdi-email/cfdi-email-bulk.component';

@NgModule({
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    MatExpansionModule,
  ],
  declarations: [
    CfdiXmlComponent,
    CfdiPdfComponent,
    CfdiTimbrarComponent,
    CfdiEmailComponent,
    CfdiCancelarComponent,
    CfdiEmailBulkComponent,
    ...CFDI_COMPONENTS,
  ],
  exports: [
    CfdiXmlComponent,
    CfdiPdfComponent,
    CfdiTimbrarComponent,
    CfdiEmailComponent,
    CfdiCancelarComponent,
    CfdiEmailBulkComponent,
    ...CFDI_COMPONENTS,
  ],
  entryComponents: [...CFDI_ENTRY_COMPONENTS],
})
export class CfdiUiCommonModule {}
