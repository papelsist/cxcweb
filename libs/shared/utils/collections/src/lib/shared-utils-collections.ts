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
  calcularImporteDelTotal: (total: number) => {
    const val = 1.0 + IVA; //BigDecimal.valueOf(1).add(IVA);
    const importe = round(total / val, 2);
    return importe;
  },
  calcularImpuesto: (importe: number) => round(importe * IVA, 2),
};

export function calcularImporteDelTotal(total: number) {
  const val = 1.0 + IVA; //BigDecimal.valueOf(1).add(IVA);
  const importe = round(total / val, 2);
  return importe;
}

export function calcularImpuesto(importe: number) {
  return round(importe * IVA, 2);
}
