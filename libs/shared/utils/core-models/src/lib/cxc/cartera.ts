export interface Cartera {
  clave: string;
  descripcion: string;
}

export function resolveCarteraPath(tipoCartera: string): string {
  switch (tipoCartera) {
    case 'CRE':
      return 'credito';
    case 'CON':
      return 'contado';
    case 'CHE':
      return 'cheque';
    case 'JUR':
      return 'juridico';
    default:
      return '';
  }
}
