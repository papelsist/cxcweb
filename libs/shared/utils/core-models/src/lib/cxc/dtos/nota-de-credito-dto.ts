import { Cliente } from '../../core/cliente';

export interface NotaDeCreditoDto {
  id: string;
}

export interface NotaDeCreditoDetDto {
  id: string;
}

export interface NotaDeCreditoCreateDto {
  cliente: Partial<Cliente>;
}
