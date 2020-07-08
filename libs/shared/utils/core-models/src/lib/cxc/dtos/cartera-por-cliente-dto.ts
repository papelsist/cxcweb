import { ClienteDto } from '../../dtos/cliente-dto';
import { CuentaPorCobrarDTO } from '../../dtos/cxc-dto';

export interface CarteraPorCliente {
  cliente: ClienteDto;
  fecha: string;
  saldo: number;
  cartera: CuentaPorCobrarDTO[];
}
