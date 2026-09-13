import LZString from 'lz-string';

export interface CircuitOptions {
  running?: boolean;
  hideMenu?: boolean;
  hideSidebar?: boolean;
  editable?: boolean;
  hideInfoBox?: boolean;
  mouseWheelEdit?: boolean;
}

export function isValidCircuit(ctz: string): boolean {
  try {
    if (!/^[A-Za-z0-9+\-$]+$/.test(ctz)) return false;
    const circuit = LZString.decompressFromEncodedURIComponent(ctz);
    return circuit?.startsWith('$ ') === true || /^<cir(?:\s|>)/.test(circuit ?? '');
  } catch {
    return false;
  }
}

export function circuitUrl(ctz: string, base: string, options: CircuitOptions = {}): string {
  const defaults: Required<CircuitOptions> = {
    running: true, hideMenu: true, hideSidebar: false,
    editable: false, hideInfoBox: false, mouseWheelEdit: true,
  };
  const params = new URLSearchParams();
  const circuit = LZString.decompressFromEncodedURIComponent(ctz);
  params.set(circuit ? 'cct' : 'ctz', circuit ?? ctz);
  for (const key of Object.keys(defaults) as (keyof CircuitOptions)[]) {
    params.set(key, String(options[key] ?? defaults[key]));
  }
  return `${base.replace(/\/$/, '')}/circuitjs/circuitjs.html?${params}`;
}

export function cssLength(value: number | string): string {
  return /^\d+(?:\.\d+)?$/.test(String(value)) ? `${value}px` : String(value);
}
