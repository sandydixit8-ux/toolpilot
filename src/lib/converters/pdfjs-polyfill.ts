// Polyfill DOMMatrix for pdfjs-dist (Node lacks it).
if (typeof globalThis.DOMMatrix === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.DOMMatrix = require('@napi-rs/canvas').DOMMatrix;
  } catch { /* ignore */ }
}

// Polyfill Uint8Array.prototype.toHex if missing (pdfjs 4.8.69 needs it).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (Uint8Array.prototype as any).toHex !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this).map((b) => (b as number).toString(16).padStart(2, '0')).join('');
  };
}

export {};
