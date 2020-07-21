import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import {
  sumByProperty,
  MonedaUtils,
} from '@nx-papelsa/shared/utils/collections';
import { NotaDeCargoDet } from '@nx-papelsa/shared/utils/core-models';

@Injectable()
export class CargoFormService {
  constructor() {}

  calcularPorProrrateo(form: FormGroup) {
    const montoGeneral = form.get('monto').value;
    console.log('Recalculando por PRORRATEO Monto: ', montoGeneral);

    // if (montoGeneral <= 0.0) return;
    const controls = form.get('partidas') as FormArray;
    const facturas = controls.value;
    const sobreSaldo = true;
    const base = sumByProperty(
      facturas,
      sobreSaldo ? 'documentoSaldo' : 'documentoTotal'
    );
    console.log(
      `Importe a prorratear: ${montoGeneral} Base: ${base} Tipo: ${sobreSaldo} : 'SOBRE SALDO' : 'SOBRE TOTAL'`
    );
    let acuImporte = 0.0,
      acuImpuesto = 0.0,
      acuTotal = 0.0;
    for (let index = 0; index < controls.length; index++) {
      const control = controls.at(index);
      const det: NotaDeCargoDet = control.value;
      const monto = sobreSaldo ? det.documentoSaldo : det.documentoTotal;

      const participacion = MonedaUtils.round(monto / base, 4);
      const asignado = MonedaUtils.round(montoGeneral * participacion, 2);
      console.log(
        'Partida: %i Saldo: %f Participacion: %f Asignación: %f',
        index,
        monto,
        participacion,
        asignado
      );
      const importe = MonedaUtils.calcularImporteDelTotal(asignado);
      const impuesto = MonedaUtils.calcularImpuesto(importe);
      const total = importe + impuesto;

      det.cargo = 0.0;
      det.importe = importe;
      det.impuesto = impuesto;
      det.total = total;
      controls.setControl(index, new FormControl(det));

      acuImporte += importe;
      acuImpuesto += impuesto;
      acuTotal += total;
    }
    form.patchValue({
      importe: acuImporte,
      impuesto: acuImpuesto,
      total: acuTotal,
    });
  }

  calcularPorPorcentaje(form: FormGroup) {
    const cargo = form.get('cargo').value / 100;
    console.log('Recalculando por PORCENTAJE Cargo: ', cargo);

    // if (cargo <= 0) return;
    const sobreSaldo = true; // Fixed
    const controls = form.get('partidas') as FormArray;

    let acuImporte = 0.0,
      acuImpuesto = 0.0,
      acuTotal = 0.0;

    for (let index = 0; index < controls.length; index++) {
      const control = controls.at(index);
      const det: Partial<NotaDeCargoDet> = control.value;
      det.cargo = cargo;
      const monto = sobreSaldo ? det.documentoSaldo : det.documentoTotal;
      const total = MonedaUtils.round(monto * cargo);
      const importe = MonedaUtils.calcularImporteDelTotal(total);
      const impuesto = MonedaUtils.calcularImpuesto(importe);
      det.total = total;
      det.importe = importe;
      det.impuesto = impuesto;
      console.log('Partida actualizada: ', det);
      controls.setControl(index, new FormControl(det));
      acuImporte += importe;
      acuImpuesto += impuesto;
      acuTotal += total;
    }

    form.patchValue({
      importe: acuImporte,
      impuesto: acuImpuesto,
      total: acuTotal,
    });
  }
}
