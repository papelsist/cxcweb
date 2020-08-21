import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { User } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cfdi-envio-dialog',
  templateUrl: './autorizacion-dialog.component.html',
})
export class AutorizacionDialogComponent implements OnInit {
  descripcion: string;
  user: User;
  constructor(
    private dialogRef: MatDialogRef<AutorizacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.descripcion = data.descripcion || 'FALTA DESCRIPCION';
  }

  ngOnInit() {}

  onSubmit() {
    if (this.user) {
      this.dialogRef.close(this.user);
    }
  }

  onSelection(user: User) {
    this.user = user;
  }
}
