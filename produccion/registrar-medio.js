// Une un resultado de image_gen o una descarga del navegador con su trabajo.
// No genera contenido, no mueve el original y no sustituye medios terminados.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { leerCola } from './flow/flow.js';

const extensiones = {
  imagen: new Set(['.png', '.jpg', '.jpeg', '.webp']),
  video: new Set(['.mp4', '.m4v', '.mov']),
};
const hash = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function dentro(base, destino) {
  const rel = path.relative(base, destino);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Ruta fuera de la carpeta permitida');
  // Evitar que un enlace simbolico intermedio redirija la escritura.
  let cursor = destino;
  while (cursor !== base) {
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink()) throw new Error('No se admiten enlaces simbolicos en el destino');
    cursor = path.dirname(cursor);
  }
}
export function registrarMedio(carpetaEntrada, clase, id, origenEntrada) {
  if (!extensiones[clase]) throw new Error('La clase debe ser imagen o video');
  const carpeta = fs.realpathSync(path.resolve(carpetaEntrada));
  dentro(carpeta, path.join(carpeta, 'flow', `cola-${clase === 'imagen' ? 'imagenes' : 'videos'}.json`));
  const cola = leerCola(carpeta, clase === 'imagen' ? 'imagenes' : 'videos');
  const coincidencias = cola?.trabajos?.filter((t) => t.id === id) || [];
  if (coincidencias.length !== 1) throw new Error(`El ID ${id} no identifica un unico trabajo disponible en la cola`);
  const trabajo = coincidencias[0];
  if (trabajo.clase !== clase) throw new Error('La clase no coincide con el trabajo');
  if (typeof trabajo.descarga !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(trabajo.descarga)) throw new Error('Nombre de descarga invalido');
  if (typeof trabajo.archivo !== 'string') throw new Error('Falta el destino del trabajo');
  const final = path.resolve(carpeta, trabajo.archivo);
  dentro(path.join(carpeta, clase === 'imagen' ? 'img' : 'video'), final);
  dentro(carpeta, final);
  if (fs.existsSync(final)) throw new Error('El medio final ya existe. Usa el flujo de rehacer antes de registrar otra version.');
  const origen = fs.realpathSync(path.resolve(origenEntrada));
  const ext = path.extname(origen).toLowerCase();
  if (!extensiones[clase].has(ext)) throw new Error(`Extension no admitida para ${clase}: ${ext}`);
  if (!fs.statSync(origen).isFile() || fs.statSync(origen).size === 0) throw new Error('El archivo de origen esta vacio o no es un archivo');
  const dir = path.join(carpeta, 'flow', 'descargas');
  const destino = path.join(dir, trabajo.descarga + ext);
  dentro(carpeta, destino);
  fs.mkdirSync(dir, { recursive: true });
  const existentes = fs.readdirSync(dir).filter((n) => path.parse(n).name === trabajo.descarga);
  if (existentes.length) {
    if (existentes.length === 1 && existentes[0] === path.basename(destino) && hash(destino) === hash(origen)) return destino;
    throw new Error('Ya hay otro resultado pendiente para este trabajo; recibe o revisa ese archivo primero');
  }
  fs.copyFileSync(origen, destino, fs.constants.COPYFILE_EXCL);
  return destino;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4) throw new Error('Uso: npm run medios:registrar -- <carpeta> <imagen|video> <id> <archivo-origen>');
    const destino = registrarMedio(...args);
    console.log(`Registrado: ${destino}`);
    console.log('Siguiente: npm run flow:recibir -- "' + args[0] + '" --desde "' + path.dirname(destino) + '"');
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
