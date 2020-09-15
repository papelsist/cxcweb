/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PropertyItem {
  key: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percent' | 'boolean';
  label?: string;
  className?: string;
}

export interface BeanPropertyListItem<T> {
  name: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percent' | 'boolean';
  label: string;
  tooltip?: string;
  icon?: string | ((value: any) => string); // Icon string or a funtion tu calculate the icon name based on value
  className?: string | ((value: any) => string); // Icon string or a funtion tu calculate the icon name based on value
  // className?: string; // Special class to decorate ListItem
  valueFormatter?: (value: any) => string;
  valueGetter?: (value: T) => any;
}
