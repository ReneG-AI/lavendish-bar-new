#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const filePath = process.argv[2] || 'assets/3d/pina-colada-hero-v4.glb';
const abs = path.resolve(filePath);

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(abs)) fail(`Missing ${filePath}`);
const data = fs.readFileSync(abs);
if (data.length < 20) fail('File too small to be GLB.');
if (data.toString('utf8',0,4) !== 'glTF') fail('Invalid GLB magic.');
if (data.readUInt32LE(4) !== 2) fail('Expected GLB v2.');
if (data.readUInt32LE(8) !== data.length) fail('Declared GLB size mismatch.');

let offset = 12;
let json;
let binBytes = 0;
while (offset + 8 <= data.length) {
  const len = data.readUInt32LE(offset);
  const type = data.readUInt32LE(offset + 4);
  const start = offset + 8;
  const end = start + len;
  if (end > data.length) fail('Chunk exceeds file boundary.');
  if (type === 0x4E4F534A) {
    const text = data.toString('utf8', start, end).replace(/\u0000+$/g,'').trim();
    json = JSON.parse(text);
  } else if (type === 0x004E4942) {
    binBytes += len;
  }
  offset = end;
}
if (!json) fail('Missing JSON chunk.');

const nodes = json.nodes || [];
const meshes = json.meshes || [];
const mats = json.materials || [];
const names = nodes.map(n => n.name || '').filter(Boolean);
const required = ['Glass','Liquid','Foam','Straw','Pineapple','Cherry'];
const missing = required.filter(n => !names.includes(n));
if (missing.length) fail(`Missing semantic nodes: ${missing.join(', ')}`);
const ice = names.filter(n => /^Ice_\d+$/i.test(n));
if (ice.length < 5) fail(`Expected >=5 independent ice nodes, found ${ice.length}`);
if (meshes.length < 10) fail(`Too few meshes for hero asset: ${meshes.length}`);
if (mats.length < 8) fail(`Too few materials for hero asset: ${mats.length}`);

const sizeMB = data.length / 1024 / 1024;
if (sizeMB > 12) fail(`GLB exceeds 12 MB hard review threshold: ${sizeMB.toFixed(2)} MB`);

console.log('LAVENDISH Piña Colada Hero v4');
console.log(`Size: ${sizeMB.toFixed(2)} MB`);
console.log(`Nodes: ${nodes.length}`);
console.log(`Meshes: ${meshes.length}`);
console.log(`Materials: ${mats.length}`);
console.log(`Ice nodes: ${ice.length}`);
console.log(`BIN: ${(binBytes/1024/1024).toFixed(2)} MB`);
console.log('PASS: structural hero-asset contract satisfied. Visual approval is separate and mandatory.');
