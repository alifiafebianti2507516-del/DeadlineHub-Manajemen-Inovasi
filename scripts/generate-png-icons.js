import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// CRC32 implementation for PNG chunks
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with scanline filters
  // 1 byte filter (0) per scanline + width * 4 bytes RGBA
  const rawBytes = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  for (let y = 0; y < height; y++) {
    rawBytes[offset++] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      // Rounded corner masking if not maskable
      let alpha = 255;
      if (!isMaskable) {
        let dx = 0;
        let dy = 0;
        if (x < cornerRadius) dx = cornerRadius - x;
        else if (x > width - 1 - cornerRadius) dx = x - (width - 1 - cornerRadius);
        if (y < cornerRadius) dy = cornerRadius - y;
        else if (y > height - 1 - cornerRadius) dy = y - (height - 1 - cornerRadius);

        if (dx > 0 && dy > 0) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > cornerRadius) {
            alpha = 0;
          } else if (dist > cornerRadius - 1.5) {
            alpha = Math.floor(255 * (cornerRadius - dist) / 1.5);
          }
        }
      }

      if (alpha === 0) {
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        continue;
      }

      // Background gradient: Deep royal blue (#1E3A8A -> #0284C7)
      const gradT = (x + y) / (width + height);
      let r = Math.round(30 + gradT * (2 - 30));
      let g = Math.round(58 + gradT * (132 - 58));
      let b = Math.round(138 + gradT * (199 - 138));

      // Draw calendar card in center
      const cardPad = isMaskable ? width * 0.20 : width * 0.16;
      const cardLeft = cardPad;
      const cardRight = width - cardPad;
      const cardTop = cardPad + (isMaskable ? 0 : width * 0.04);
      const cardBottom = height - cardPad;

      if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
        // Inside calendar card
        const cardHeaderH = (cardBottom - cardTop) * 0.28;
        if (y <= cardTop + cardHeaderH) {
          // Calendar top navy bar
          r = 30; g = 58; b = 138;
        } else {
          // White calendar body
          r = 248; g = 250; b = 252;

          // Checkmark circle badge bottom-right
          const badgeX = cardRight - (cardRight - cardLeft) * 0.28;
          const badgeY = cardBottom - (cardBottom - cardTop) * 0.28;
          const badgeR = (cardRight - cardLeft) * 0.18;
          const distBadge = Math.hypot(x - badgeX, y - badgeY);

          if (distBadge <= badgeR) {
            // Emerald green circle
            r = 16; g = 185; b = 129;
            // Draw white checkmark inside
            const cxCheck = x - badgeX;
            const cyCheck = y - badgeY;
            // Checkmark geometry
            if (
              (cxCheck >= -badgeR * 0.4 && cxCheck <= 0 && Math.abs(cyCheck - cxCheck * 1.2) < badgeR * 0.2) ||
              (cxCheck >= 0 && cxCheck <= badgeR * 0.55 && Math.abs(cyCheck + cxCheck * 0.9) < badgeR * 0.2)
            ) {
              r = 255; g = 255; b = 255;
            }
          } else {
            // Calendar grid dots
            const gridY = y - (cardTop + cardHeaderH);
            const rowH = (cardBottom - cardTop - cardHeaderH) / 3;
            if (gridY > rowH * 0.5 && gridY < rowH * 2.5) {
              const colW = (cardRight - cardLeft) / 4;
              const gridX = x - cardLeft;
              const colIdx = Math.floor(gridX / colW);
              const rowIdx = Math.floor(gridY / rowH);
              const dotCx = (colIdx + 0.5) * colW;
              const dotCy = (rowIdx + 0.5) * rowH;
              if (Math.hypot(gridX - dotCx, gridY - dotCy) < colW * 0.2) {
                if (colIdx === 0 && rowIdx === 0) {
                  r = 59; g = 130; b = 246; // Active blue dot
                } else {
                  r = 203; g = 213; b = 225; // Light gray dot
                }
              }
            }
          }
        }
      }

      // Yellow graduation emblem on top of navy header
      if (y >= cardTop - 4 && y <= cardTop + (cardBottom - cardTop) * 0.18) {
        const capX = cx;
        const capY = cardTop + (cardBottom - cardTop) * 0.10;
        const dxCap = Math.abs(x - capX);
        const dyCap = Math.abs(y - capY);
        if (dxCap * 0.6 + dyCap < width * 0.04) {
          r = 253; g = 224; b = 71; // gold accent
        }
      }

      rawBytes[offset++] = r;
      rawBytes[offset++] = g;
      rawBytes[offset++] = b;
      rawBytes[offset++] = alpha;
    }
  }

  // Compress with zlib
  const compressedData = zlib.deflateSync(rawBytes, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate all required PWA icons
const icons = [
  { file: 'pwa-192x192.png', size: 192, maskable: false },
  { file: 'pwa-512x512.png', size: 512, maskable: false },
  { file: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const { file, size, maskable } of icons) {
  const pngBuffer = createPng(size, size, maskable);
  const targetPath = path.join(publicDir, file);
  fs.writeFileSync(targetPath, pngBuffer);
  console.log(`Generated: ${file} (${size}x${size}, maskable=${maskable})`);
}

console.log('All PWA icons generated successfully.');
