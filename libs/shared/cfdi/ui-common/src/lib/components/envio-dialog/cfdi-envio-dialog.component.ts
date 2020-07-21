import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cfdi-envio-dialog',
  templateUrl: './cfdi-envio-dialog.component.html',
  styleUrls: ['./cfdi-envio-dialog.component.scss'],
})
export class CfdiEnvioDialogComponent implements OnInit {
  control: FormControl;
  constructor(
    private dialogRef: MatDialogRef<CfdiEnvioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.control = new FormControl(data.email, {
      validators: [Validators.required, Validators.email],
      updateOn: 'change',
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }
}
