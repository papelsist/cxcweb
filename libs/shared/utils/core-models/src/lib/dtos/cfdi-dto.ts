export interface CfdiDto {
  id: string;
  serie: string;
  folio: string;
  fecha: string;
  tipoDeComprobante: string;
  uuid: string;
  total: number;
  email?: string;
  enviado?: string;
}
