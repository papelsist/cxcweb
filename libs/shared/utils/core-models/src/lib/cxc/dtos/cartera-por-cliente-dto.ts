import { ClienteDto } from '../../dtos/cliente-dto';
import { CuentaPorCobrarDTO } from '../../dtos/cxc-dto';

export interface CarteraPorClienteDto {
  cliente: ClienteDto;
  fecha?: string;
  saldo: number;
  cartera: CuentaPorCobrarDTO[];
}
