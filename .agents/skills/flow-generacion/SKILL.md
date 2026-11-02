---
name: flow-generacion
description: Ejecuta las colas de anuncios de este proyecto con imagenes Nano Banana 2.1 y videos en Google Flow mediante el navegador conectado. Usar despues de npm run imagenes o npm run videos, o al generar, recibir o rehacer medios del anuncio.
---

# Generar medios con Codex + Google Flow

Leer AGENTS.md y la seccion 1.1 de COMO-PRODUCIR.md. Esta skill es el puente
entre las colas del motor y las herramientas de la sesion, no un cliente API.

Por defecto imagenes Nano Banana 2.1 y videos Omni 1.1 Flash en Flow; respetar
el modelo de cada trabajo, incluidas las hojas que el motor pide a Nano Banana
Pro. image_gen queda disponible solo a peticion expresa, nunca como sustitucion.

## 0. Reglas operativas

- El prompt de la cola se pega tal cual. Aplicar los cuatro reintentos y el
  ajuste acotado de la seccion 6; registrar lo cambiado, no improvisar otra escena.
- Usar un proyecto Flow por anuncio y guardar su URL en `flow/proyecto.txt`.
- Guardar envios, reintentos y resultados por ID en `flow/estado-codex.json`;
  al reanudar, inspeccionar lo enviado antes de duplicarlo.
- Mostrar creditos del lote completo, incluidos trabajos de vueltas siguientes.
  Continuar dentro del alcance y presupuesto ya aprobados sin pedirlos de nuevo.
- La descarga pertenece a la produccion autorizada. No pedir permiso por tanda.
- El usuario resuelve contrasenas, CAPTCHA, terminos y permisos que lo requieran.
- Trabajar en las pestanas del anuncio, dejando las otras del usuario intactas.

## 1. Preparar el navegador de Codex

Descubrir las herramientas de navegador presentes. En sesiones con `cua_repl`,
la primera llamada solo puede ser una entrada documentada, por ejemplo:

```js
await cua.getState();
```

Leer la documentacion devuelta. Abrir o seleccionar el navegador solicitado;
por ejemplo, con Chrome conectado y sin otra preferencia:

```js
let flowTab = await cua.createBrowserTab('chrome', 'https://labs.google/fx/tools/flow', {
  sessionName: '🎬 Anuncios Codex'
});
```

Usar la URL guardada del proyecto cuando exista. Si hay varios perfiles,
identificar el que tiene la cuenta correcta. No tomar una pestana ajena ni
crear un proyecto nuevo al reanudar. Para un anuncio nuevo crear un proyecto
solo cuando se vaya a producir. Obtener el estado tras cada grupo de acciones
y basar los selectores en los controles visibles actuales.

Estas llamadas son ejemplos de la API observada, no una garantia universal.
Si la sesion ofrece otra herramienta, leer SU documentacion y adaptar el flujo.
Si no hay navegador conectado, informar y guiar al alumno para conectarlo en
su app. No instalar la extension Claude in Chrome, no usar `/chrome` ni inventar
una extension o un comando de conexion. El ZIP no incluye herramientas de Codex.

## 2. Leer la cola

Leer `temp/<anuncio>/flow/cola-imagenes.json` o `cola-videos.json`. Cada
trabajo trae (formato completo en `produccion/flow/flow.js`, TrabajoFlow):

| Campo | Para que |
|---|---|
| `archivo` | destino final (lo coloca flow:recibir, no Codex) |
| `descarga` | nombre con el que se descarga, sin extension |
| `modo` | `imagen`, `fotogramas` (frame inicial y final), `ingredientes` (referencias) o `texto` |
| `modelo` / `respaldo` | modelo de Flow a elegir, y el de respaldo |
| `prompt` | se pega tal cual |
| `referencias` | imagenes a adjuntar, **en este orden** |
| `frame_inicial` / `frame_final` | modo fotogramas: "Iniciar" y "Finalizar" |
| `duracion` | segundos a elegir en Flow (4, 6, 8 o 10) |
| `proporcion` | 9:16, 1:1... |
| `calidad_descarga` | opcion del menu de descarga: 1K, 2K o 720p |
| `habla` | el clip tiene dialogo: revisar que se escuche |
| `fondo` | `verde`: icono sobre verde croma (flow:recibir lo vuelve transparente) |

`bloqueados` son trabajos que todavia no se pueden pedir: no tocarlos.

## 3. Subir o reutilizar referencias

Subir primero las referencias distintas de la cola que aun no esten en Flow.
Los frames generados en el mismo proyecto se eligen de la biblioteca. Si el
motor cambio el archivo (frame heredado, recorte o copia modificada), usar la
version local correcta; no asumir que la miniatura de Flow coincide.

Leer la documentacion de cargas del navegador. Con cua_repl, iniciar
`tab.playwright.waitForEvent('filechooser')` antes de pulsar el boton observado
de cargar, esperar el selector y usar `setFiles` con rutas absolutas. Respetar
los limites documentados y verificar cada miniatura antes de adjuntarla.
No inyectar inputs ni los antiguos ayudantes JavaScript de Claude.

Si Chrome requiere "Allow access to file URLs", el usuario lo habilita en
chrome://extensions > ChatGPT > Detalles > Permitir acceso a URLs de archivo.
Explicar el permiso una vez y reanudar tras confirmacion; no repetir ese pedido
cuando ya esta concedido. Ver INSTALAR.md, Paso 8.

## 4. Mandar los trabajos

**Enviar los trabajos independientes seguidos**, hasta el limite de concurrencia
que permita Flow. Despues se revisan juntos. Los bloqueados esperan otra vuelta.

### Ajustes (boton de ajustes de la caja del prompt, el que muestra el modelo)

- Imagen: pestana **Imagen**, la proporcion, el modelo (lista "Seleccionar
  familia de modelos": Nano Banana 2.1, Nano Banana Pro...), **x1**.
- Video: pestana **Video**, **Fotogramas** o **Ingredientes** segun `modo`,
  9:16, modelo (Omni 1.1 Flash por defecto), **720p**, la `duracion`, **x1**.
  El menu muestra cuantos creditos usa.
- Los ajustes se mantienen entre envios. Mirar el texto del boton antes de
  cada envio (por ejemplo "Video · 720p · 8 s · x1") y corregir si cambio.
- Para cerrar el menu de ajustes, clic en una zona vacia de la pagina.

### Por cada trabajo

- **Imagen con referencias**: "+" > elegir cada referencia en la biblioteca >
  "Agregar a la instruccion", **en el orden de la cola**. Las miniaturas quedan
  arriba del prompt.
- **Video fotogramas**: clic en "Iniciar" > elegir `frame_inicial` > "Agregar a
  la instruccion". Si hay `frame_final`: "Finalizar" > elegirlo.
- **Video ingredientes**: "+" > cada referencia en orden.
- Clic en la caja del prompt, escribir el `prompt` con la herramienta documentada y enviar
  con la flecha. Aparece una tarjeta con el porcentaje.
- **Nunca escribir saltos de linea**: en la caja de Flow, Enter ENVIA. Si el
  prompt trae lineas (por ejemplo el bloque "Negative prompt:" o las lineas
  "Camera:/Motion:" de un video), escribirlo en una sola linea cambiando cada
  salto por un espacio. El contenido se conserva. Verificar el campo antes de enviar; no usar
  Enter para insertar saltos si ese control lo interpreta como envio.
- Si la caja quedo con referencias del trabajo anterior, quitarlas (la X de la
  caja) antes de armar el siguiente.

Anotar en `temp/<anuncio>/flow/estado-codex.json` que se mando (ID, archivo,
modelo, prompt, URL visible y hora) para no mandar dos veces lo mismo si la sesion se corta.

## 5. Revisar lo generado

Cuando las tarjetas terminan (desaparece el porcentaje):

- Abrir cada resultado (clic) o ampliar la captura de la grilla y mirarlo de
  verdad: personaje correcto y consistente, producto real (forma, etiqueta),
  sin texto inventado, sin manos o caras deformes, encuadre y accion que pide
  el prompt. En video: que haya movimiento y, si `habla`, que la boca se mueva.
- Si una **imagen** sale mal: se regenera (comprobar el costo visible). Flow guarda las
  versiones; descargar la buena.
- Si un **video** sale mal: **no se regenera sin el ok del usuario**. Regenerar
  un video se cobra otra vez: decirle que clip salio mal, por que, y cuantos
  creditos cuesta repetirlo (los de su duracion), y esperar el si. Los reintentos de la seccion 6 no necesitan otro ok si no agregan
  costos fuera del presupuesto autorizado.
  En los estilos con dialogo, si para arreglarlo hay que cambiar lo que se
  dice, el cambio va primero al manifiesto (COMO-PRODUCIR.md lo explica): un
  clip que dice otra cosa que el manifiesto sale con subtitulos equivocados.

## 6. Fallos y reintentos

Flow a veces rechaza con "No se pudo completar la accion. Es posible que esta
generacion incumpla nuestras politicas". Puede ser un falso positivo. Aplicar esta recuperacion a solicitudes
permitidas; si el motivo identifica contenido no permitido, corregir el contenido
para cumplirlo, sin ocultarlo mediante eufemismos. Verificar el costo visible.

1. **Reintentar hasta 4 veces** con el boton de reintentar de la tarjeta
   (flecha circular). Se pueden reintentar varias tarjetas a la vez.
2. Si a la cuarta sigue fallando, algo del prompt activa el filtro. En la
   tarjeta, "reutilizar instruccion" (flecha de volver) pone el prompt en la
   caja con sus referencias. Corregir SOLO la parte problematica o ambigua del prompt de forma
   permitida, conservando la escena y su objetivo. Reenviar el prompt corregido.
   No reescribir el guion completo ni cambiar producto, estilo o mensaje.
3. Anotar cada cambio en `temp/<anuncio>/flow/cambios-de-prompt.md`: ID,
   archivo, prompt original, prompt corregido, motivo, intentos y respuesta de
   Flow. Conservar ese ID al registrar la descarga con `medios:registrar`.
   Contarselo al usuario al final. En dialogo_nativo (UGC, objeto parlante,
   podcast y entrevista), cambiar primero la linea y su prompt en el manifiesto,
   validar y regenerar la cola; no editar solo el texto de Flow, porque se
   desincronizan los subtitulos. Antes recibir los resultados buenos de la tanda.
   Mantener funcion y largo de la frase, y las reglas particulares de cada estilo.
   Podcast/entrevista: hasta 3 reescrituras segun COMO-PRODUCIR, seccion 12;
   despues mostrar las frases y avisos. Para los otros estilos conservar sus
   reglas de recuperacion; no introducir limites de reescritura nuevos.
4. Si un video falla todos los intentos con `modelo` y tiene `respaldo`, el
   respaldo (Veo 3.1 Fast) cuesta mas creditos: **preguntarle al usuario y
   esperar el si** (el menu de ajustes de Flow muestra cuanto cuesta) antes de
   mandarlo. Recordar el id para `--respaldo` en flow:recibir.
5. Si Flow dice que no hay creditos, o muestra un limite de generaciones a la
   vez, parar y avisar al usuario.


Contar los reintentos por ID y prompt, incluso tras reanudar una sesion. No
contar un clic sin respuesta ni repetir un trabajo que sigue procesando.
Un error de red/servidor no justifica cambiar el guion: comprobar si se creo
el trabajo, esperar y reintentar sin duplicar. Los estilos hablados conservan
su pauta de espera de COMO-PRODUCIR, seccion 12. Cuota, autenticacion o CAPTCHA
no se solucionan repitiendo prompts. Un video generado defectuoso se trata
con la seccion 5 y `npm run rehacer`, no como un rechazo sin generacion.

## 7. Descargar y registrar por ID

Abrir el recurso correcto y comprobar prompt, referencias, tipo imagen/video
y registro de envio. Dos recursos pueden tener el mismo titulo: mirar la vista
previa y el indicador de video. Si cambio el prompt, usar el ID registrado en
`flow/cambios-de-prompt.md`, no adivinar a partir del titulo.

Iniciar `tab.playwright.waitForEvent('download')` antes del clic de descarga;
elegir `calidad_descarga` (imagen 1K/2K, video 720p) y obtener `path()`.
Si el evento expira o devuelve null, comprobar si Chrome ya guardo el archivo
por el nombre del recurso observado y su contenido. No volver a generar ni
elegir simplemente el archivo mas reciente. Usar `downloadMedia` solo cuando
la API y el recurso visible lo admitan. No usar APIs privadas, tokens ni
JavaScript inyectado para renombrar o interceptar descargas.

```text
npm run medios:registrar -- temp/<anuncio> imagen|video <id> <ruta-descargada>
npm run flow:recibir -- temp/<anuncio> --desde temp/<anuncio>/flow/descargas
```

El registro conserva el original y prepara el nombre que espera el receptor.
Comprobar archivo completo, contenido, proporcion y duracion. Registrar la ruta
real y el estado recibido. Si falta una capacidad, explicar el bloqueo preciso
y pedir solo la accion manual necesaria, sin afirmar que ya se descargo.

## 8. Recibir y seguir

1. `npm run flow:recibir -- temp/<anuncio>` (con `--respaldo id1,id2` si
   alguno salio del modelo de respaldo). `--rehacer` SOLO si el archivo viejo
   sigue en `img/` o `video/` y se quiere reemplazar (lo manda a `historial/`).
   Al rehacer una toma con `npm run rehacer`, el viejo ya salio de la carpeta:
   ahi va sin `--rehacer` (asi lo piden COMO-PRODUCIR.md y las skills).
   Imagenes: si una no sale bien con su `modelo` tras los reintentos, se puede
   probar el `respaldo` (comprobar su costo actual) y se anota igual con `--respaldo`.
2. Leer el resumen: si hay **faltan**, descargar esos; si hay **rechazados**
   (por ejemplo un clip mas corto de lo pedido o un clip hablado sin audio),
   regenerar ese trabajo en Flow y volver a recibir.
3. Volver a correr `npm run imagenes` (o `videos`): si arma una cola nueva,
   leer la cola nueva y repetir desde la seccion 3, sin volver a generar lo recibido.
   Cuando diga que no queda nada, volver a la skill del estilo.

## 9. Al terminar

- Informar imagenes/videos generados, reintentos, prompts cambiados y motivo,
  creditos usados y cualquier bloqueo que quede.
- Entregar solo tras resolver pendientes y revisar los medios reales.
- Conservar la pestana entregable o pendiente con la capacidad documentada;
  no cerrar pestanas del usuario ni dejar un trabajo activo sin registrar.

## Detalles de interfaz que se conservan del original

- La biblioteca puede esconder referencias ya adjuntas y cambiar el orden:
  observarla de nuevo antes de cada seleccion.
- START y END pueden compartir titulo: verificar su vista previa.
- Quitar referencias del trabajo anterior antes del siguiente.
- Comprobar modelo, proporcion, resolucion, duracion y x1 antes de enviar.
- Si la interfaz cambia, buscar los controles por su funcion observable.
