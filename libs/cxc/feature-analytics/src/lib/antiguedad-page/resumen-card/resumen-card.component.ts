import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { BeanPropertyListItem } from '@nx-papelsa/shared/utils/core-models';
import { Antiguedad } from '../antiguedad-models';

@Component({
  selector: 'papx-cxc-resumen-card',
  templateUrl: './resumen-card.component.html',
  styleUrls: ['./resumen-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenCardComponent implements OnInit {
  @Input() antiguedad: Partial<Antiguedad>;

  properties: BeanPropertyListItem<Antiguedad>[] = [
    {
      name: 'de1_30',
      label: '1 a 30 Días',
      type: 'currency',
      icon: 'warning',
    },
    {
      name: 'de31_60',
      label: '31 a 60 Días',
      type: 'currency',
      icon: 'error',
    },
    {
      name: 'de61_90',
      label: '61 a 90 Días',
      type: 'currency',
      icon: 'report_problem',
    },
    {
      name: 'mas90',
      label: 'Más de 90 Días',
      type: 'currency',
      icon: 'report',
    },
  ];
  constructor() {}

  ngOnInit() {}

  getClassForItem(item: BeanPropertyListItem<Antiguedad>, ant: Antiguedad) {
    if (item.className) {
      if (typeof item.className === 'function') {
        return item.className(ant[item.name]);
      } else {
        return item.className;
      }
    }
    return '';
  }
}
