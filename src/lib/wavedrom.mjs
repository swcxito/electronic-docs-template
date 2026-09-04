import WaveDrom from 'wavedrom';
import defaultSkin from 'wavedrom/skins/default.js';
import narrowSkin from 'wavedrom/skins/narrow.js';
import lowkeySkin from 'wavedrom/skins/lowkey.js';
import onml from 'onml';
import JSON5 from 'json5';

const skins = { ...defaultSkin, ...narrowSkin, ...lowkeySkin };
const escapeXml = (value) => String(value).replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)|[<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[c]));

// onml.stringify does not escape text or attribute values itself.
function escapeTree(node) {
  return node.map((item, index) => {
    if (index === 0) return item;
    if (Array.isArray(item)) return escapeTree(item);
    if (item && typeof item === 'object') {
      return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, escapeXml(value)]));
    }
    return escapeXml(item);
  });
}

/** @param {Record<string, unknown> | string} source */
export function renderWaveDrom(source) {
  const data = typeof source === 'string' ? JSON5.parse(source) : structuredClone(source);
  if (!data || !['signal', 'reg', 'assign'].some((key) => Array.isArray(data[key]) && data[key].length)) {
    throw new Error('WaveDrom requires a non-empty signal, reg, or assign array.');
  }
  const svg = WaveDrom.renderAny(0, data, structuredClone(skins));
  if (svg[0] !== 'svg') throw new Error('WaveDrom did not produce an SVG.');
  return onml.stringify(escapeTree(svg));
}
