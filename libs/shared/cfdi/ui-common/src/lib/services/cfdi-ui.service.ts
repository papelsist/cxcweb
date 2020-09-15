import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  Cfdi,
  Cliente,
  CfdiDto,
  CuentaPorCobrarDTO,
  ClienteDto,
  GrupoDeCfdis,
} from '@nx-papelsa/shared/utils/core-models';
import { groupByProperty } from '@nx-papelsa/shared/utils/collections';

@Injectable({ providedIn: 'root' })
export class CfdiUiService {
  constructor() {}

  sendByEmail(cfdi: Partial<Cfdi>, email: string) {}

  enviarFacturasEnGrupo(rows: CuentaPorCobrarDTO[]) {
    const grupos = groupByProperty(rows, 'nombre');
    const res = Object.keys(grupos).map((key) => {
      const value: CuentaPorCobrarDTO[] = grupos[key];
      const cfdis = value.map((item) => item.cfdi);
      const { nombre, cfdiMail } = value[0].cliente;
      return { nombre, target: cfdiMail, cfdis };
    });
    this.enviarEnGrupos(res);
  }

  enviarEnGrupos(grupos: GrupoDeCfdis[]) {
    console.group();
    grupos.forEach((g) => {
      console.log(
        'Enviando %i  Cfdis a: %s Cliente: %s',
        g.cfdis.length,
        g.target,
        g.nombre
      );
    });
    console.groupEnd();
  }
}
