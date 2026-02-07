const fs = require('fs');
const path = require('path');

// Create a simple colored PNG using pure Node.js
// Since we don't have sharp, we'll create a valid PNG manually

const width = 1200;
const height = 630;

// PNG header + IHDR chunk
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crc32(data) {
  let crc = -1;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuffer = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

// IHDR chunk
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type (RGB)
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const ihdrChunk = createChunk('IHDR', ihdr);

// Simple gradient data (uncompressed would be huge, so we use a solid color)
const zlib = require('zlib');
const rowData = [];
for (let y = 0; y < height; y++) {
  rowData.push(0); // filter byte
  for (let x = 0; x < width; x++) {
    // Dark purple-blue gradient
    const r = Math.floor(10 + (y / height) * 20);
    const g = Math.floor(10 + (y / height) * 15);
    const b = Math.floor(15 + (y / height) * 30);
    rowData.push(r, g, b);
  }
}

const compressed = zlib.deflateSync(Buffer.from(rowData));
const idatChunk = createChunk('IDAT', compressed);

// IEND chunk
const iendChunk = createChunk('IEND', Buffer.alloc(0));

const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync(path.join(__dirname, 'public', 'og-image.png'), png);
console.log('✅ og-image.png generated');
