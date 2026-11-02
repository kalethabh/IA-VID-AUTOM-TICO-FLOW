# Anuncios IA — Codex + Google Flow

Edicion para alumnos, instalada solo en la carpeta de este proyecto.

- Codex prepara guiones y controla el navegador conectado.
- Google Flow genera las imagenes con Nano Banana 2.1 y los videos con el modelo de la cola.
- El motor conserva los 12 estilos, continuidad, voces, musica, revisiones y montaje.

## Empezar

1. Descomprime TODO el ZIP en una carpeta propia, conservando `.agents`.
2. Abre esa carpeta como proyecto en Codex y crea un chat dentro de ella.
3. Escribe: **«Lee AGENTS.md e instala este sistema solo en este proyecto.
   Quiero imagenes con Nano Banana 2.1 y videos en Google Flow».**
4. Codex revisara los requisitos de `INSTALAR.md`. Cada alumno conecta su
   navegador e inicia sesion en su propia cuenta de Google Flow.
5. Pide, por ejemplo: **«Quiero un anuncio estilo Pixar para este producto»**
   y adjunta una foto o enlace del producto.

El ZIP contiene instrucciones y programas locales. No habilita por si mismo
herramientas de Codex ni incluye una cuenta, extension, sesion o creditos.
Para automatizar hacen falta las herramientas de navegador disponibles
EN TU SESION de Codex. Si una falta, Codex debe indicarlo antes de generar.
No necesitas Claude Code ni Claude in Chrome para esta edicion.

## Que se conserva

Crochet, claymation, Zack D Films, Pixar, Lego, skeleton, UGC, objeto parlante,
musicales, historias musicales, podcast y entrevista; ademas del efecto continuidad.
ElevenLabs sigue a cargo de voz/transcripcion y kie.ai/Suno de musica/canciones.
Las pistas incluidas, guiones, manifiestos y ensamblador Remotion se conservan.

## Archivos y comandos

- `AGENTS.md`: instrucciones que lee Codex al trabajar en el proyecto.
- `.agents/skills/`: 14 skills locales. No copiarlas al perfil global.
- `INSTALAR.md`: instalacion y conexion de herramientas.
- `COMO-PRODUCIR.md`: produccion, revisiones y montaje por estilo.
- `ACTUALIZAR.md`: actualizaciones con respaldo.
- `npm run verificar`: diagnostico local; no prueba las herramientas de Codex.
- `npm run test:codex`: pruebas locales del puente, sin generar medios pagos.
- `npm run alumnos`: crea un ZIP limpio y verifica sus huellas en `dist/`.

`npm run imagenes` y `npm run videos` preparan colas. El asistente debe
realizar la generacion; estos comandos por si solos no producen imagenes/videos.
Cada anuncio vive en `temp/`; los videos finales salen en `output/`.
No compartas tu `.env` ni tus carpetas de anuncios. Comparte el ZIP de `dist/`.

## Condiciones de los servicios

Se conservan los avisos del sistema original: cada alumno necesita sus propias
cuentas, cuota y permisos. Antes de publicar o contratar, revisar las condiciones
vigentes de [ElevenLabs](https://elevenlabs.io/pricing) y la
[licencia de Remotion](https://www.remotion.dev/license), incluido su uso comercial
y la automatizacion de renders. El ZIP no incluye licencias de esos servicios.

## Revision de esta edicion

`AUDITORIA-CODEX.md` describe la comparacion contra el ZIP original, las reglas
recuperadas y las pruebas realizadas. Para actualizar una instalacion anterior,
seguir `ACTUALIZAR.md`; no copiar la carpeta nueva encima de los anuncios.
