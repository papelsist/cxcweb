export interface Cfdi {
  id: string;
  serie?: string;
  folio?: string;
  uuid: string;
  tipoDeComprobante: string;
  origen?: string;
  email?: string;
  enviado?: string;
  comentario?: string;
}

export function formatUUID(uuid: string) {
  return uuid ? uuid.substr(-6) : '';
}
