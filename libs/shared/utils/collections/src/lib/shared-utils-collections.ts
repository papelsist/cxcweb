import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import round from 'lodash/round';
// import debounce from 'lodash/debounce';

export const IVA = 0.16;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sumByProperty(source: any[], property: string) {
  return sumBy(source, property);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sumByFn(source: any[], fn: any) {
  return sumBy(source, fn);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByProperty(source: any[], property: string) {
  return groupBy(source, property);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByFn(source: any[], fn: any) {
  return groupBy(source, fn);
}

export const MonedaUtils = {
  round: round,
  calcularImporteDelTotal: (total: number, faction = 2) => {
    const val = 1.16; //BigDecimal.valueOf(1).add(IVA);
    const res = total / val;
    const importe = round(res, faction);
    return importe;
  },
  calcularImpuesto: (importe: number) => round(importe * IVA, 2),
  aplicarDescuentos: (importe: number, descuentos: number[]) => {
    let neto = importe;
    descuentos.forEach((dd) => {
      if (!dd && dd > 0.0) {
        const descuento = (neto * dd) / 100;
        neto = round(neto - descuento, 2);
      }
    });
    return neto;
  },
};

export function calcularImporteDelTotal(total: number) {
  const val = 1.0 + IVA; //BigDecimal.valueOf(1).add(IVA);
  const importe = round(total / val, 2);
  return importe;
}

export function calcularImpuesto(importe: number) {
  return round(importe * IVA, 2);
}

export function aplicarDescuentos(importe: number, descuentos: number[]) {
  let neto = importe;
  descuentos
    .map((descto) => descto / 100)
    .forEach((dd) => {
      const descuento = round(neto * dd, 2);
      neto = neto - descuento;
    });
  return neto;
}
