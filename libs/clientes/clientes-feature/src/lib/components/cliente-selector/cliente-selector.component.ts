import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';

import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-selector-cxc',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit {
  clientes$: Observable<Cliente[]>;

  control = new FormControl(null, [Validators.required]);

  loading = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ClienteSelectorComponent, Cliente[]>
  ) {}

  ngOnInit() {
    this.control.valueChanges.subscribe((val) =>
      console.log('Selected value: ', val)
    );
  }

  doSubmit() {
    // this.dialogRef.close(this.selectedRows);
    console.log('Submit: ', this.control.value);
  }

  onSelection(selection: Cliente[]) {
    console.log('Selection: ', selection);
    this.dialogRef.close(selection);
  }

  search(event: string) {}
}
