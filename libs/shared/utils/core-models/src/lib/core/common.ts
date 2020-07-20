export interface Direccion {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  codigoPostal: string;
  colonia: string;
  municipio?: string;
  estado: string;
  pais: 'MEXICO' | 'Mexico' | 'México' | 'ESTADOS UNIDOS' | 'CANADA';
  latitud?: string;
  longitud?: string;
}

export function buildDireccionKey(direccion: Direccion) {
  return `${direccion.calle.substring(0, 20)} #${direccion.numeroExterior} CP:${
    direccion.codigoPostal
  }`;
}

export const buildDireccionEmpty = (): Direccion => {
  return {
    calle: null,
    numeroExterior: null,
    codigoPostal: null,
    colonia: null,
    municipio: null,
    estado: null,
    pais: 'MEXICO',
  };
};
