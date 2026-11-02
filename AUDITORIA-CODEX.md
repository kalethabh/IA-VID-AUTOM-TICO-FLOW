# Revision contra el paquete original — 2026-10-22

Origen: `anuncios-ia-flow-alumnos (3).zip`, edicion Claude Code + Google Flow.
Destino: edicion Codex + Google Flow, VERSION `2026-10-22`.

## Alcance y resultado

Se inventariaron los 119 archivos del ZIP original y se compararon sus hashes
con la copia adaptada, mapeando `CLAUDE.md` a `AGENTS.md` y `.claude/skills/`
a `.agents/skills/`. Se revisaron las diferencias de documentos y programas;
los paquetes `.skill` se regeneran desde sus fuentes locales.

- 70 archivos originales se distribuyen sin cambios de contenido binario:
  incluyen el ensamblador Remotion, recursos, ejemplo y la mayor parte del motor.
- 47 archivos originales tienen adaptaciones: instrucciones, 14 fuentes de
  skills y sus 14 paquetes, configuracion/distribucion y el puente Codex.
- 2 ayudantes antiguos de inyeccion en la pagina no se distribuyen:
  `produccion/flow/ayudantes-navegador.js` y `produccion/flow/js-para-flow.js`.
  Sus funciones de identificacion y nombrado se sustituyen por observacion del
  recurso, registro por ID y `produccion/registrar-medio.js`, usando las
  herramientas documentadas del navegador de Codex.

No se instalaron skills ni configuracion en el perfil global.

## Correcciones respecto a la entrega anterior de Codex

La adaptacion anterior habia resumido en exceso instrucciones operativas y
contenia una contradiccion entre los cuatro reintentos del motor y la guia del
asistente. Esta entrega recupera:

- Hasta cuatro reintentos del mismo prompt para una solicitud permitida ante
  un posible falso positivo; despues, ajuste minimo permitido y reenvio,
  conservando escena, producto, estilo y mensaje. Un rechazo que identifica
  contenido no permitido exige corregir ese contenido, no esconderlo.
- Registro del prompt original, correccion, motivo, intentos e ID; en clips
  hablados, actualizar primero el manifiesto para conservar los subtitulos.
- Las reglas particulares de cada estilo, incluida la revision de clips
  hablados, limites propios de reescritura y aprobacion de regeneraciones
  pagadas o cambio a un respaldo de mayor costo fuera del alcance aprobado.
- Envio de trabajos independientes, orden de referencias, dependencias entre
  vueltas, recepcion de resultados buenos antes de reconstruir una cola,
  reanudacion del mismo proyecto y conservacion del historial.
- Las instrucciones detalladas de voces, musica fija, montaje, instalacion
  pendiente, personalizacion y actualizacion con respaldo del original.

Se corrigieron un nombre de extension inventado por sustitucion de texto y una
referencia residual al ayudante de descargas de Claude. Los permisos de
produccion ya concedidos no se vuelven a pedir por cada tanda de descargas.

## Que se mantiene y que cambia por la integracion

Las 13 skills creativas (12 estilos y continuidad) conservan su contenido
original, salvo la nota de integracion y referencias tecnicas a Codex, sus
rutas y el registro de descargas. La comparacion de texto normalizada verifico
las 13, sin cambios de guion, voces, duraciones ni decisiones creativas.

Google Flow es el proveedor predeterminado de imagenes y videos. Se conservan
los modelos de la cola: Nano Banana 2.1 por defecto, Nano Banana Pro para las
hojas que ya lo requerian, y Omni 1.1 Flash para video segun el motor original.
El modelo y el costo se comprueban en la interfaz actual. La alternativa
`image_gen` solo se usa si el usuario la pide expresamente.

ElevenLabs conserva voz y transcripcion; kie.ai/Suno conserva musica y canciones.
No se cambiaron sus clientes ni el motor de montaje. Las claves quedan en
`.env`, no se muestran en el diagnostico ni se incluyen en el ZIP. Las guias
de instalacion usan dependencias del proyecto y explican el entorno Python
local sin cambiar el perfil global. Los precios del original son referencias
historicas que deben comprobarse antes de comprar o generar.

Los comandos `imagenes` y `videos` preparan colas: el asistente sigue siendo
quien opera Flow. El ZIP no incluye la extension, herramientas, sesiones,
cuentas ni creditos de los alumnos.

## Verificacion

- 8 pruebas locales del puente: proveedor Flow predeterminado, opcion nativa,
  referencias y bloqueos, registro/recepcion real de archivos, transparencia,
  errores de IDs/rutas y conservacion de configuracion privada.
- 11 comparaciones de ejecucion contra el codigo del ZIP original: configuracion
  Flow completa, planes de imagen/video completos y filtrados, colas por
  dependencias en tres vueltas e iconos con croma. Las comparaciones de colas
  ignoran solo dos campos nuevos de metadatos (`proveedor` y
  `transparent_background`); los prompts, modelos, referencias y demas campos
  coinciden. Las fixtures son simulaciones locales, no nuevas generaciones.
- Validacion de las 14 skills y regeneracion de sus paquetes.
- Empaquetado con lista permitida de archivos, verificacion de huellas del
  contenido y SHA256 del ZIP. Se excluyen claves, sesiones, anuncios privados,
  dependencias instaladas y archivos temporales.

Esta revision no repite generaciones pagadas ni prueba las cuentas de todos los
alumnos. La prueba real anterior obtuvo una imagen Nano Banana en Flow; el video
Flow y el montaje de prueba usaron la imagen nativa generada previamente. No se
presenta esa prueba como una nueva ejecucion completa Nano Banana → video.
Un fallo en otro equipo requiere revisar el error y la conexion disponible;
no permite atribuir automaticamente la causa al alumno ni garantiza que el
paquete este libre de cualquier fallo.
