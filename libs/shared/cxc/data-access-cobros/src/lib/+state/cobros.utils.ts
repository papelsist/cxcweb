const STORAGE_KEY = 'sx.cobros.state';

export function persistCobrosState(state: {
  disponibles: boolean;
  porTimbrar: boolean;
}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function readCobrosState(): {
  disponibles: boolean;
  porTimbrar: boolean;
} {
  return (
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      disponibles: false,
      porTimbrar: false,
    }
  );
}
