export interface PropertyItem {
  key: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percent' | 'boolean';
  label?: string;
  className?: string;
}
