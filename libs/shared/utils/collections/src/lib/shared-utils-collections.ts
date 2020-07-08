import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
// import debounce from 'lodash/debounce';

export function sumByProperty(source: [], property: string) {
  return sumBy(source, property);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByProperty(source: any[], property: string) {
  return groupBy(source, property);
}
