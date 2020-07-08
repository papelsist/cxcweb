import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import round from 'lodash/round';
// import debounce from 'lodash/debounce';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sumByProperty(source: any[], property: string) {
  return sumBy(source, property);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByProperty(source: any[], property: string) {
  return groupBy(source, property);
}

export const MonedaUtils = {
  round: round,
};
