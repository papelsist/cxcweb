import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cfdi-envio-bulk-dialog',
  templateUrl: './envio-bulk-dialog.component.html',
  styleUrls: ['./envio-bulk-dialog.component.scss'],
})
export class EnvioBulkDialogComponent implements OnInit {
  grupos: any[];
  constructor(
    private dialogRef: MatDialogRef<EnvioBulkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.grupos = data.grupos;
  }

  ngOnInit() {}

  onSubmit() {
    // console.log('Grupos: ', this.grupos);
    this.dialogRef.close(this.grupos);
  }
}
