import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
// import debounce from 'lodash/debounce';

export function sumByProperty(source: [], property: string) {
  return sumBy(source, property);
}

export function groupByProperty(source: [], property: string) {
  return groupBy(source, property);
}
