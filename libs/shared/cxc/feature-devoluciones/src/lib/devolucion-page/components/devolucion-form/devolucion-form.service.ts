import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import {
  sumByProperty,
  MonedaUtils,
  aplicarDescuentos,
} from '@nx-papelsa/shared/utils/collections';

import { NotaDeCreditoDet } from '@nx-papelsa/shared/utils/core-models';

@Injectable()
export class DevolucionFormService {
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
      sobreSaldo ? 'saldoDocumento' : 'totalDocumento'
    );
    console.log(
      `Importe a prorratear: ${montoGeneral} Base: ${base} Tipo: ${sobreSaldo} : 'SOBRE SALDO' : 'SOBRE TOTAL'`
    );

    for (let index = 0; index < controls.length; index++) {
      const control = controls.at(index);
      const det: NotaDeCreditoDet = control.value;
      const monto = sobreSaldo ? det.saldoDocumento : det.totalDocumento;

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

      const newValue = { ...det, importe, impuesto, total };
      control.setValue(newValue);
    }
  }

  calcularPorPorcentaje(form: FormGroup) {
    const base = form.get('baseDelCalculo').value;
    const descuento = form.get('descuento').value;
    const descuento2 = form.get('descuento2').value || 0.0;
    const partidas = form.get('partidas') as FormArray;
    const controls = partidas.controls;

    console.group('Calculando importes por PORCENTAJE');
    console.log('Base de calculo: %s', base);
    console.log('Descuento : %f  Descuento 2: %f', descuento, descuento2);

    for (const ctrl of controls) {
      const value: NotaDeCreditoDet = ctrl.value;
      const property = base === 'Saldo' ? 'saldoDocumento' : 'totalDocumento';
      const monto = value[property];
      const res = monto - aplicarDescuentos(monto, [descuento, descuento2]);

      const importe = MonedaUtils.calcularImporteDelTotal(res);
      const impuesto = MonedaUtils.calcularImpuesto(importe);
      const total = importe + impuesto;
      console.log('Partida: ', value);
      console.log('Documento: %i [%s]:%f ', value.documento, base, monto);
      console.log('Total: ', total);

      const newValue = { ...value, importe, impuesto, total };
      ctrl.setValue(newValue);
    }

    console.groupEnd();
  }
}
