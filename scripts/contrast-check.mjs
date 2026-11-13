// Computes WCAG 2.x contrast ratios for the colour pairs used by the portal.
// Reads the design tokens from client/src/styles/global.css so it never drifts from the CSS.
// Run: npm run contrast
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const cssPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/src/styles/global.css');
const css = readFileSync(cssPath, 'utf8');
const tokens = {};
for (const [, name, hex] of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) tokens[name] = hex;
tokens.white = '#ffffff';

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground token, background token, minimum ratio, what it is used for]
const PAIRS = [
  ['ink', 'surface', 4.5, 'Body text on white'],
  ['ink', 'bg', 4.5, 'Body text on page background'],
  ['muted', 'surface', 4.5, 'Secondary text on white'],
  ['muted', 'bg', 4.5, 'Secondary text on page background'],
  ['navy-900', 'surface', 4.5, 'Headings on white'],
  ['navy-700', 'surface', 4.5, 'Links on white'],
  ['navy-700', 'bg', 4.5, 'Links on page background'],
  ['white', 'navy-900', 4.5, 'Header/footer text'],
  ['white', 'navy-800', 4.5, 'Hero heading/text'],
  ['on-dark-muted', 'navy-800', 4.5, 'Hero lead text'],
  ['on-dark-muted', 'navy-900', 4.5, 'Footer text'],
  ['gold-400', 'navy-800', 4.5, 'Hero eyebrow text'],
  ['navy-900', 'gold-400', 4.5, 'Gold button / skip link text'],
  ['white', 'navy-900', 4.5, 'Primary button text'],
  ['danger', 'surface', 4.5, 'Error text on white'],
  ['danger', 'danger-bg', 4.5, 'Error summary / error message'],
  ['success', 'success-bg', 4.5, 'Success message'],
  ['info', 'info-bg', 4.5, 'Progress message'],
  ['border', 'surface', 3, 'Input borders (non-text, 1.4.11)'],
  ['danger', 'surface', 3, 'Invalid input border (non-text)'],
  ['navy-900', 'surface', 3, 'Focus ring on light backgrounds (non-text)'],
  ['gold-400', 'navy-900', 3, 'Focus ring on dark backgrounds (non-text)'],
  ['gold-400', 'navy-800', 3, 'Focus ring on hero (non-text)'],
];

let failures = 0;
console.log('Foreground      Background      Ratio   Min   Result  Usage');
for (const [fg, bg, min, usage] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`Missing token for pair ${fg} / ${bg}`);
    failures += 1;
    continue;
  }
  const value = ratio(tokens[fg], tokens[bg]);
  const ok = value >= min;
  if (!ok) failures += 1;
  console.log(
    `${fg.padEnd(15)} ${bg.padEnd(15)} ${value.toFixed(2).padStart(5)}   ${String(min).padEnd(4)}  ${ok ? 'PASS  ' : 'FAIL  '}  ${usage}`,
  );
}
console.log(failures === 0 ? '\nAll colour pairs meet their minimum ratio.' : `\n${failures} pair(s) below the minimum.`);
process.exit(failures === 0 ? 0 : 1);
