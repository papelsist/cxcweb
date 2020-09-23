export interface VentaMensual {
  indice: number;
  periodo: string;
  origenId: string;
  descripcion: string;
  ventaNeta: number;
  costo: number;
  importeUtilidad: number;
  porcentajeUtilidad: number;
  porcentajeAportacion: number;
  inventarioCosteado: number;
  kilos: number;
  precio_kilos: number;
  porcentajePartVN: number;
  costoKilos: number;
  participacion?: number;
  participacionTipo?: string;
}

export interface VentaNetaMensual extends VentaMensual {
  kilosInv: number;
}

export interface VentaNetaAcumulada extends VentaMensual {
  nacional: string;
  porcentajePartVN: number;
}

export interface VentaCommand {
  ejercicio: number;
  mes: number;
  slice: string;
  tipoDeVenta: string;
  tipoDeProducto: string;
}
