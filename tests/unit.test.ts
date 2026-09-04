import test from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { circuitUrl, cssLength, isValidCircuit } from '../src/lib/circuit.ts';
import { circuitExample, timingExample } from '../src/lib/examples.ts';
import { renderWaveDrom } from '../src/lib/wavedrom.mjs';

test('original circuit is preserved and passes decompression validation', () => {
  assert.equal(isValidCircuit(circuitExample), true);
  for (const invalid of ['', 'errortest', '<script>', LZString.compressToEncodedURIComponent('not a circuit')]) {
    assert.equal(isValidCircuit(invalid), false);
  }
});

test('CircuitJS URLs work at root and project paths, preserving encoded plus signs', () => {
  for (const base of ['/', '/electronic-docs-template', '/electronic-docs-template/']) {
    const url = new URL(circuitUrl(circuitExample, base), 'https://example.com');
    assert.equal(url.pathname, `${base.replace(/\/$/, '')}/circuitjs/circuitjs.html`);
    assert.equal(url.searchParams.get('ctz'), circuitExample);
    assert.equal(url.searchParams.get('running'), 'true');
    assert.equal(url.searchParams.get('editable'), 'false');
    assert.equal(url.searchParams.get('hideMenu'), 'true');
    assert.equal(url.searchParams.get('hideSidebar'), 'false');
    assert.equal(url.searchParams.get('hideInfoBox'), 'false');
    assert.equal(url.searchParams.get('mouseWheelEdit'), 'true');
  }
});

test('all simulation options can override defaults including false', () => {
  const overrides = { running: false, hideMenu: false, hideSidebar: true, editable: true, hideInfoBox: true, mouseWheelEdit: false };
  const url = new URL(circuitUrl(circuitExample, '/', overrides), 'https://example.com');
  for (const [key, value] of Object.entries(overrides)) assert.equal(url.searchParams.get(key), String(value));
});

test('legacy pixel dimensions and CSS dimensions are supported', () => {
  assert.equal(cssLength(600), '600px');
  assert.equal(cssLength('600'), '600px');
  assert.equal(cssLength('600px'), '600px');
  assert.equal(cssLength('100%'), '100%');
});

test('WaveDrom output is deterministic, self-contained, and does not mutate data', () => {
  const source = structuredClone(timingExample);
  const svg = renderWaveDrom(source);
  assert.match(svg, /^<svg/);
  assert.match(svg, /<defs>/);
  assert.match(svg, /clk/);
  assert.match(svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.equal(renderWaveDrom(source), svg);
  assert.deepEqual(source, timingExample);
});

test('WaveDrom parses JSON5 and supports register and logic diagrams', () => {
  assert.match(renderWaveDrom("{signal:[{name:'clk',wave:'p..'}],}"), /^<svg/);
  assert.match(renderWaveDrom({ reg: [{ bits: 8, name: 'DATA' }] }), /^<svg/);
  assert.match(renderWaveDrom({ assign: [['out', ['&', 'a', 'b']]] }), /^<svg/);
});

test('malformed WaveDrom input fails instead of silently publishing a blank diagram', () => {
  for (const input of ['{ invalid', {}, { signal: [] }, 'null']) {
    assert.throws(() => renderWaveDrom(input));
  }
});

test('waveform labels remain valid XML', () => {
  const svg = renderWaveDrom({ signal: [{ name: 'A & B < C', wave: '01' }] });
  assert.match(svg, /A &amp; B &lt; C/);
});
