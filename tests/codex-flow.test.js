import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { proveedorImagenes, escribirCola, leerCola, nombreDescarga } from '../produccion/flow/flow.js';
import { colaDeImagenes } from '../produccion/generar-imagenes.js';
import { registrarMedio } from '../produccion/registrar-medio.js';
import { recibirDeFlow } from '../produccion/flow-recibir.js';
import { delUsuario } from '../produccion/actualizar.js';

function fixture(t) {
  const temporal = fileURLToPath(new URL('../temp/', import.meta.url));
  fs.mkdirSync(temporal, { recursive: true });
  const base = fs.mkdtempSync(path.join(temporal, 'codex-flow-test-'));
  t.after(() => {
    assert.ok(path.resolve(base).startsWith(path.resolve(temporal) + path.sep));
    fs.rmSync(base, { recursive: true, force: true });
  });
  const carpeta = path.join(base, 'anuncio');
  fs.mkdirSync(carpeta);
  return { base, carpeta };
}
function entorno(t, valor) {
  const antes = process.env.IMAGENES_PROVEEDOR;
  if (valor === undefined) delete process.env.IMAGENES_PROVEEDOR;
  else process.env.IMAGENES_PROVEEDOR = valor;
  t.after(() => { if (antes === undefined) delete process.env.IMAGENES_PROVEEDOR; else process.env.IMAGENES_PROVEEDOR = antes; });
}
const icono = { id: 'icono-1', clase: 'icono', archivo: 'icono-1.png', prompt: 'Red circular icon on transparent background', fondo: 'transparente', descripcion: 'Icono con fondo transparente', referencias: [], aspectRatio: '1:1' };
const manifiesto = { estilo: 'podcast', tomas: [], broll: [], referencias: [] };
function imagen(carpeta) {
  return colaDeImagenes([icono], { carpeta, manifiesto }).trabajos[0];
}

test('Codex opcional mantiene prompt, referencias y alfa sin croma', (t) => {
  entorno(t, 'codex');
  const { carpeta } = fixture(t);
  const trabajo = imagen(carpeta);
  assert.equal(proveedorImagenes(), 'codex');
  assert.equal(trabajo.modelo, 'image_gen');
  assert.equal(trabajo.prompt, icono.prompt);
  assert.equal(trabajo.fondo, 'transparente');
  assert.equal(trabajo.transparent_background, true);
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo] });
  assert.equal(leerCola(carpeta, 'imagenes').proveedor, 'codex');
  escribirCola(carpeta, 'videos', { trabajos: [] });
  assert.equal(leerCola(carpeta, 'videos').proveedor, 'flow');
});

test('Flow predeterminado usa Nano Banana 2.1 y conserva el croma original', (t) => {
  entorno(t, undefined);
  const { carpeta } = fixture(t);
  const trabajo = imagen(carpeta);
  assert.equal(trabajo.proveedor, 'flow');
  assert.equal(proveedorImagenes(), 'flow');
  assert.equal(trabajo.modelo, 'Nano Banana 2.1');
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo] });
  assert.equal(leerCola(carpeta, 'imagenes').proveedor, 'flow');
  assert.equal(trabajo.fondo, 'verde');
  assert.notEqual(trabajo.prompt, icono.prompt);
  assert.notEqual(trabajo.modelo, 'image_gen');
});

test('Una referencia inexistente bloquea la toma; al recibirla conserva el orden', (t) => {
  entorno(t, 'codex');
  const { carpeta } = fixture(t);
  const m = { ...manifiesto, referencias: [{ id: 'producto', archivo: 'producto.png' }, { id: 'persona', archivo: 'persona.png' }] };
  const plan = [{ ...icono, referencias: ['persona', 'producto'] }];
  let cola = colaDeImagenes(plan, { carpeta, manifiesto: m });
  assert.equal(cola.trabajos.length, 0);
  assert.equal(cola.bloqueados.length, 1);
  fs.writeFileSync(path.join(carpeta, 'producto.png'), 'fixture');
  fs.writeFileSync(path.join(carpeta, 'persona.png'), 'fixture');
  cola = colaDeImagenes(plan, { carpeta, manifiesto: m });
  assert.deepEqual(cola.trabajos[0].referencias.map((p) => path.basename(p)), ['persona.png', 'producto.png']);
});

test('Registro y recepcion reales conservan alfa, origen y atribucion Codex', (t) => {
  entorno(t, 'codex');
  const { base, carpeta } = fixture(t);
  const trabajo = imagen(carpeta);
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo] });
  const origen = path.join(base, 'resultado.png');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=black@0.0:s=64x64,format=rgba,drawbox=x=16:y=16:w=32:h=32:color=red@1:t=fill:replace=1', '-frames:v', '1', origen]);
  const destino = registrarMedio(carpeta, 'imagen', trabajo.id, origen);
  assert.equal(registrarMedio(carpeta, 'imagen', trabajo.id, origen), destino);
  assert.ok(fs.existsSync(origen));
  recibirDeFlow(carpeta, { desde: path.dirname(destino), decir: () => {} });
  const log = JSON.parse(fs.readFileSync(path.join(carpeta, 'img/log-modelos.json'), 'utf8'));
  const entrada = log.imagenes.find((x) => x.id === trabajo.id);
  assert.equal(entrada.proveedor, 'codex');
  assert.equal(entrada.modelo, 'codex:image_gen');
  assert.equal(entrada.transparente, true);
  assert.equal(entrada.creditos, null);
  assert.equal(entrada.fondoQuitado, undefined);
  assert.ok(fs.existsSync(path.join(carpeta, trabajo.archivo)));
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, origen), /ya existe/);
});

test('Video de prueba atraviesa el mismo registro/receptor con proveedor Flow', (t) => {
  const { base, carpeta } = fixture(t);
  const archivo = 'video/toma-1.mp4';
  const trabajo = { id: 'toma-1', clase: 'video', archivo, descarga: nombreDescarga(carpeta, archivo), modelo: 'fixture-model', proporcion: '1:1', duracion: 1, duracion_pedida: 1, exacta: false, habla: false, sin_sonido: false };
  escribirCola(carpeta, 'videos', { trabajos: [trabajo] });
  const origen = path.join(base, 'clip.mp4');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=64x64:r=24', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '1', '-c:v', 'libx264', '-c:a', 'aac', '-shortest', origen]);
  const staging = registrarMedio(carpeta, 'video', trabajo.id, origen);
  recibirDeFlow(carpeta, { desde: path.dirname(staging), decir: () => {} });
  assert.ok(fs.existsSync(path.join(carpeta, archivo)));
  const log = JSON.parse(fs.readFileSync(path.join(carpeta, 'video/log-modelos.json'), 'utf8'));
  assert.equal(log.clips[0].proveedor, 'flow');
});

test('Registro rechaza IDs ajenos, duplicados, rutas externas y archivos incompletos', (t) => {
  entorno(t, 'codex');
  const { base, carpeta } = fixture(t);
  const trabajo = imagen(carpeta);
  const origen = path.join(base, 'resultado.png');
  fs.writeFileSync(origen, 'fixture');
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo] });
  assert.throws(() => registrarMedio(carpeta, 'imagen', 'otro', origen), /unico trabajo/);
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo, trabajo] });
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, origen), /unico trabajo/);
  escribirCola(carpeta, 'imagenes', { trabajos: [{ ...trabajo, archivo: '../fuera.png' }] });
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, origen), /fuera/);
  escribirCola(carpeta, 'imagenes', { trabajos: [{ ...trabajo, descarga: '../fuera' }] });
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, origen), /invalido/);
  escribirCola(carpeta, 'imagenes', { trabajos: [trabajo] });
  fs.writeFileSync(origen, '');
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, origen), /vacio/);
  const parcial = path.join(base, 'imagen.crdownload');
  fs.writeFileSync(parcial, 'partial');
  assert.throws(() => registrarMedio(carpeta, 'imagen', trabajo.id, parcial), /Extension/);
});

test('Proveedor invalido falla y el actualizador conserva configuracion privada', (t) => {
  entorno(t, 'inventado');
  assert.throws(proveedorImagenes, /codex o flow/);
  assert.equal(delUsuario('.agents/skills/flow-generacion/SKILL.md'), false);
  for (const p of ['.agents/config.json', '.codex/config.toml', '.claude/settings.json', '.env', 'temp/anuncio/manifiesto.json', 'output/clip.mp4', 'dist/archivo.zip']) assert.equal(delUsuario(p), true, p);
});

test('El CLI de imagenes anuncia el proveedor real sin prometer gratuidad', () => {
  const salida = execFileSync(process.execPath, ['produccion/generar-imagenes.js', 'ejemplo-anuncio', '--solo-plan'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    env: { ...process.env, IMAGENES_PROVEEDOR: 'codex' }, encoding: 'utf8',
  });
  assert.match(salida, /image_gen integrado/);
  assert.doesNotMatch(salida, /0 creditos|Nano Banana|para Google Flow/);
});

