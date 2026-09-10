#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const filePath = process.argv[2] || 'assets/3d/pina-colada-v3.glb';
const abs = path.resolve(process.cwd(), filePath);

function fail(message, code = 1) {
  console.error(`FAIL: ${message}`);
  process.exit(code);
}

if (!fs.existsSync(abs)) fail(`GLB not found: ${filePath}`);

const data = fs.readFileSync(abs);
if (data.length < 20) fail('File is too small to be a valid GLB.');

const magic = data.toString('utf8', 0, 4);
const version = data.readUInt32LE(4);
const declaredLength = data.readUInt32LE(8);
if (magic !== 'glTF') fail(`Invalid magic header: ${JSON.stringify(magic)}`);
if (version !== 2) fail(`Expected GLB version 2, got ${version}`);
if (declaredLength !== data.length) fail(`Declared length ${declaredLength} does not match file length ${data.length}`);

let offset = 12;
let json = null;
let binBytes = 0;
while (offset + 8 <= data.length) {
  const chunkLength = data.readUInt32LE(offset);
  const chunkType = data.readUInt32LE(offset + 4);
  const chunkStart = offset + 8;
  const chunkEnd = chunkStart + chunkLength;
  if (chunkEnd > data.length) fail('Chunk length exceeds file boundary.');
  if (chunkType === 0x4E4F534A) {
    const text = data.toString('utf8', chunkStart, chunkEnd).replace(/\u0000+$/g, '').trim();
    try { json = JSON.parse(text); }
    catch (error) { fail(`glTF JSON chunk is not parseable: ${error.message}`); }
  } else if (chunkType === 0x004E4942) {
    binBytes += chunkLength;
  }
  offset = chunkEnd;
}
if (!json) fail('No glTF JSON chunk found.');

const nodes = Array.isArray(json.nodes) ? json.nodes : [];
const meshes = Array.isArray(json.meshes) ? json.meshes : [];
const materials = Array.isArray(json.materials) ? json.materials : [];
const images = Array.isArray(json.images) ? json.images : [];
const textures = Array.isArray(json.textures) ? json.textures : [];
const nodeNames = nodes.map((n) => n?.name || '').filter(Boolean);
const materialNames = materials.map((m) => m?.name || '').filter(Boolean);
const extensionsUsed = new Set(Array.isArray(json.extensionsUsed) ? json.extensionsUsed : []);

const requiredExact = ['Glass', 'Liquid', 'Foam', 'Straw', 'Pineapple', 'Cherry'];
const requiredPhysicalExtensions = [
  'KHR_materials_transmission',
  'KHR_materials_ior',
  'KHR_materials_volume',
  'KHR_materials_clearcoat'
];
const missing = requiredExact.filter((name) => !nodeNames.includes(name));
const missingPhysical = requiredPhysicalExtensions.filter((name) => !extensionsUsed.has(name));
const iceNodes = nodeNames.filter((name) => /^Ice_\d+$/i.test(name));
const meshNodeCount = nodes.filter((node) => Number.isInteger(node?.mesh)).length;
const fileMB = data.length / 1024 / 1024;

console.log('LAVENDISH Piña Colada v3 GLB report');
console.log(`File: ${filePath}`);
console.log(`Size: ${fileMB.toFixed(2)} MB`);
console.log(`Nodes: ${nodes.length}`);
console.log(`Mesh definitions: ${meshes.length}`);
console.log(`Mesh nodes: ${meshNodeCount}`);
console.log(`Materials: ${materials.length}`);
console.log(`Textures: ${textures.length}`);
console.log(`Images: ${images.length}`);
console.log(`BIN payload: ${(binBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Ice nodes: ${iceNodes.length}`);
console.log(`Material names: ${materialNames.join(', ') || '(none)'}`);
console.log(`Extensions used: ${[...extensionsUsed].join(', ') || '(none)'}`);
console.log(`Named nodes: ${nodeNames.join(', ') || '(none)'}`);

const errors = [];
const warnings = [];
if (missing.length) errors.push(`missing required nodes: ${missing.join(', ')}`);
if (!iceNodes.length) errors.push('no independently named Ice_XX nodes found');
if (meshes.length <= 1 || meshNodeCount <= 1) errors.push('model appears to contain one mesh only; assembly requires separable components');
if (!materials.length) errors.push('no materials found');
if (missingPhysical.length) errors.push(`missing required physical-material extensions: ${missingPhysical.join(', ')}`);
if (fileMB > 12) warnings.push('file exceeds the 12 MB investigation threshold for web delivery');
if (!textures.length && !images.length) warnings.push('material-only PBR asset: no raster textures/images; acceptable because physical shading is encoded through material factors/extensions');

for (const warning of warnings) console.warn(`WARN: ${warning}.`);
for (const error of errors) console.error(`FAIL: ${error}.`);
if (errors.length) process.exit(2);

console.log('PASS: structural node contract and physical-material contract satisfied. Browser visual/PBR review is still required.');
