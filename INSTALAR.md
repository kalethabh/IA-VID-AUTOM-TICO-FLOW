# Instalación — instrucciones para Codex

**Este archivo lo lees y lo EJECUTAS tú, no el usuario.** Él solo tiene que
contestar unas pocas preguntas, pegar sus claves, instalar una extensión de
Chrome e iniciar sesión en Google. Todo lo demás lo haces tú.

Ve paso por paso. **Confirma que cada paso funcionó antes de pasar al
siguiente**, y dile al usuario en una línea qué acabas de hacer. Si algo falla,
explícale qué pasó en español sencillo y cómo lo vas a resolver — nunca le
pegues un error en crudo sin traducirlo.

**Si tienes que pedirle que cierre y vuelva a abrir Codex** (después de
instalar Node, ffmpeg o Python, o para conectar Chrome), puede necesitarse reanudar el trabajo en otra conversación. **Antes de pedírselo**, escribe en la raíz el archivo
`.instalacion-pendiente.md` con lo que falta y lo que el usuario ya decidió (por
ejemplo: "faltan los paquetes de Python del Paso 7: va a hacer podcast con el
host en la esquina; falta el Paso 8; no quiere música de kie.ai"). La sesión
nueva lo lee primero (`AGENTS.md`, punto 1), termina lo que dice y lo borra.

**Una instalación nueva no necesita actualizar nada**: el zip ya trae su
versión (la dice el archivo `VERSION`), y `ACTUALIZAR.md` es solo para quien ya
tiene instalada una versión anterior. Si el usuario ya tenía el sistema
instalado en otra carpeta (con sus anuncios en `temp/`) y lo que quiere es
pasarlo a esta versión, no lo instales de nuevo aquí: eso se hace desde su
carpeta de siempre, con el zip y su `ACTUALIZAR.md` (`AGENTS.md`, punto 6).

---

## Antes del primer comando — alcance y permisos

Instalar las skills y dependencias del proyecto solamente en esta carpeta.
No cambiar perfiles globales. Respetar las autorizaciones ya concedidas y la
aprobacion automatica configurada, sin prometer que cubra permisos de Chrome.
Si falta un programa de sistema, explicar y acordar esa instalacion por separado.
Antes de reiniciar, guardar `.instalacion-pendiente.md` como indica arriba.
Las cifras de precios y planes que siguen son referencia del original: verificar
las condiciones vigentes antes de recomendar compras. No comprar planes ni saldo.

## Paso 1 — Mira qué falta

```
npm run verificar
```

Ese comando revisa todo y te dice exactamente qué falta. Los pasos de abajo
resuelven cada cosa que puede salir mal. **Haz solo los que hagan falta.**

Los pasos 8 y 9 (Chrome y Google Flow) el comando no los puede revisar desde la
terminal. Por eso, cuando salen bien, se anotan con
`npm run verificar -- --flow-listo` (último punto del Paso 9), y mientras no
estén anotados el comando lo dice ("Chrome, la conexion de navegador de Codex y
Google Flow todavia no se confirmaron") y no cierra en "Todo listo". Si lo dice,
esos dos pasos se hacen, **aunque el `.env` ya exista**: pasa cuando el usuario
reinició Codex a mitad de la instalación. Si ya están anotados, no los
repitas: el navegador se vuelve a comprobar cada vez que se empieza a generar
(skill `flow-generacion`).

Cómo leer lo que imprime:

| Marca | Qué significa |
|---|---|
| `OK` | listo |
| `FALTA` | sin esto no se puede seguir. El comando termina en "Hay N cosa(s) por resolver" |
| `AVISO` | depende de lo que vaya a hacer el usuario. Tres dejan el cierre en "Casi listo" mientras estén pendientes, y esa línea dice cuáles: la clave de ElevenLabs, que usan todos los estilos (Paso 4); Remotion, que hace falta para el MP4 terminado (quien monta él mismo en CapCut puede dejarlo así: Paso 6), y la confirmación de Chrome, la extensión y Google Flow (pasos 8 y 9). Los demás pueden quedar así a propósito: `KIE_API_KEY` vacía si no va a usar música generada, y Python si no va a hacer entrevista ni podcast con el host en la esquina. `ELEVENLABS_VOICE_ID` vacía se resuelve en el Paso 5 |

El punto 9 termina con una lista para revisar a mano (la extensión, la sesión de
Google en Flow, las pestanas del proyecto): esa la resuelves tú en los pasos 8 y 9.

---

## Paso 2 — Node.js

`npm run verificar` necesita Node para correr. Si el comando ni siquiera
arranca, Node no está instalado. Si arranca pero dice "Node.js ... es muy viejo
(hace falta 20.12 o superior)", hay que actualizarlo: con una versión anterior
el motor no puede leer el `.env`.

- **Comprueba**: `node --version`. Hace falta **20.12 o superior**.
- **Si falta o es viejo**: dile al usuario que lo descargue de
  <https://nodejs.org> (la versión LTS) y que lo instale con las opciones por
  defecto. Usar el metodo oficial disponible y autorizado para su equipo.
  Cuando termine, pídele que cierre y vuelva a abrir Codex, porque si no
  la terminal sigue sin ver Node.

---

## Paso 3 — ffmpeg

Es lo que corta, mide y arma el video. Sin esto no se puede producir nada.

- **Comprueba**: `ffmpeg -version`
- **Si falta**:
  - **Windows**: `winget install Gyan.FFmpeg` en una terminal. Si `winget` no
    existe, dile que lo baje de <https://www.gyan.dev/ffmpeg/builds/> (la
    versión `full`), lo descomprima, y guíalo para agregar la carpeta `bin` al
    PATH.
  - **Mac**: `brew install ffmpeg`. Si no tiene Homebrew, primero
    <https://brew.sh>.
- Después de instalarlo, **haz que cierre y reabra Codex** y vuelve a
  comprobar.

---

## Paso 4 — Los servicios y las claves

### Antes de pedir nada, explícale qué servicio hace qué

**El usuario paga su propio consumo**, así que se lo explicas antes de que se
registre en nada, no después. Muéstrale esta tabla con tus palabras:

| Servicio | Para qué | |
|---|---|---|
| **Google Flow** (<https://labs.google/fx/tools/flow>, redirige a flow.google.com) | las imágenes y los videos. Los genera Codex en el navegador conectado, con su cuenta de Google | **obligatorio**. Las imágenes cuestan 0 créditos; los videos gastan créditos de su plan de Google (recomendado Google AI Pro o Ultra). No lleva clave: se conecta en los pasos 8 y 9 |
| **ElevenLabs** | la voz en off y la transcripción de lo que se dice o se canta (subtítulos y cortes) | **obligatorio**: lo usan todos los estilos |
| **kie.ai** | solo la música de fondo y las canciones, con Suno. Centavos por anuncio | **recomendado**; **obligatorio** para musical e historias musicales |

Créditos de video de Flow, medidos con Omni 1.1 Flash a 720p: 4 s = 7, 6 s = 10
y 8 s = 12 (los de 10 s y el modelo de respaldo, más caro, sin medir). Como
referencia, el anuncio de `ejemplo-anuncio/` (crochet, 51 segundos, 32 videos)
son unos 256 créditos si cada clip sale a la primera; un clip que se regenera
suma sus créditos otra vez, y por eso regenerar un video se le pregunta antes.
Las historias musicales son las que más gastan: 60 a 80 clips para 5 minutos,
casi todos de 4 o 6 s (7 o 10 créditos cada uno; alguna línea larga, de 8 s:
12). No le des un total inventado: el del anuncio lo calcula `npm run videos`
cuando ya hay manifiesto. Antes de mandar cada tanda de videos se le dice cuánto
va a gastar y se espera su sí.

### ElevenLabs — para voz o transcripcion

1. Que entre a <https://elevenlabs.io> y cree una cuenta.
2. La clave está en su perfil, abajo a la izquierda → **API Keys**. Que cree
   una y la introduzca en el archivo local `.env` que preparas; no hace falta
   pegarla en el chat. Si ya hay una clave configurada, reutilizarla sin mostrarla.
3. El plan gratuito alcanza para probar. **Ojo**: el plan gratuito de
   ElevenLabs **no incluye licencia comercial**. Si el anuncio se va a publicar,
   necesita un plan de pago.

### kie.ai — pregúntale primero si la va a usar

Pregúntale, en una sola pregunta:

> ¿Vas a hacer anuncios con música de fondo (Pixar, claymation, crochet, UGC u
> objeto parlante) o anuncios musicales (musical o historias musicales)?

Para que conteste con todo a la vista: Lego, Zack D Films y skeleton traen su
propia pista y no usan kie.ai; podcast y entrevista van sin música; y en
cualquier estilo puede poner su propio mp3 en vez de generar uno.

- **Si dice que sí** (o no sabe todavía y quiere dejarlo listo):
  1. Que entre a <https://kie.ai> y cree una cuenta.
  2. La clave está en <https://kie.ai/api-key>. Que la copie y la guarde en el archivo local `.env`.
  3. **Hay que cargar saldo**: 1 crédito = US$0.005. Una pista de música de
     fondo cuesta 12 créditos (US$0.06); una canción, con sus versiones y sus
     extensiones, también son centavos. Con la carga más chica que ofrezca
     kie.ai le alcanza para muchos anuncios. Sin saldo, la música falla.
- **Si dice que no**: `KIE_API_KEY` queda vacía. Dile en una línea que, si más
  adelante pide un estilo con música generada, se lo vas a preguntar en ese
  momento: conectarlo entonces, o que ese anuncio salga sin música de fondo. En
  musical e historias musicales no hay opción: la canción es el anuncio.

### La carpeta de descargas de Chrome

Pregúntale si alguna vez cambió la carpeta donde Chrome guarda las descargas.
Si dice que no, o no sabe, se deja vacío: se usa la carpeta Descargas de su
usuario (`npm run verificar` muestra cuál). Si la cambió, que te diga la ruta
(la ve en Chrome → Configuración → Descargas → Ubicación) y va en
`FLOW_DESCARGAS`. Ahí llegan las imágenes y los videos de Flow, y de ahí los
toma `npm run flow:recibir`.

En la misma pantalla de Chrome (Configuración → Descargas), que mire la opción
**"Preguntar dónde se guardará cada archivo antes de descargarlo"**: si está
encendida, que la apague. Con ella, cada descarga de Flow abre una ventana del
sistema para elegir la carpeta, que tú no puedes manejar, y el primer anuncio
se traba en la primera descarga.

### Prepara el archivo `.env`

Hay dos archivos parecidos y **no son lo mismo**:

| | Qué es | Qué haces con él |
|---|---|---|
| `.env.example` | la **plantilla**, viene en la carpeta, trae los campos vacíos | **no lo toques nunca**. Solo lo lees para saber qué campos hay |
| `.env` | el archivo **de verdad**, con las claves. **No existe todavía** | **lo creas tú**, con este contenido |

Si no existe, **crea un archivo nuevo llamado `.env`** con los campos vacios
para que el usuario introduzca las claves localmente; si ya te las proporciono,
guardalas sin repetirlas. La estructura es esta
en la raíz de la carpeta, con exactamente esto:

```
KIE_API_KEY=<la clave de kie.ai, o nada si no la va a usar>
ELEVENLABS_API_KEY=<la clave de ElevenLabs que te dio>
ELEVENLABS_VOICE_ID=
IMAGENES_PROVEEDOR=flow
FLOW_DESCARGAS=<la ruta de sus descargas, o nada si usa la normal>
```

Sin comillas y sin espacios alrededor del `=`. `ELEVENLABS_VOICE_ID` se queda
vacío por ahora: se rellena en el Paso 5. Si el `.env` ya existía (por ejemplo,
en una segunda pasada por esta guía), no lo pises: edita solo el campo que
falta.

`npm run verificar` dice "copia .env.example y renombralo a .env" cuando el
archivo no existe. Esa ayuda es para quien lo hace a mano: **aquí lo escribes
tú**, con el contenido de arriba.

**Prepara tú la carpeta y los archivos y guía al usuario si necesita ayuda.**
Para las claves, ofrece introducirlas localmente sin pegarlas en el chat.
**No repitas las claves en tus respuestas**: para confirmar,
basta con decir que quedaron guardadas (`npm run verificar` mantiene las claves ocultas).

> **Por qué son dos archivos y no uno.** `.env` está en `.gitignore` y
> `.env.example` no. O sea: el que lleva secretos está marcado para no
> compartirse nunca, y el molde vacío sí puede viajar. Si las claves se pegaran
> en `.env.example`, acabarían justo en el archivo que sí se comparte.

**Y díselo al usuario en una línea**: que sus claves quedaron guardadas en un
archivo local de su máquina, y que si algún día comparte
esta carpeta ese archivo no viaja.

---

## Paso 5 — La voz

El archivo `.env` tiene un campo `ELEVENLABS_VOICE_ID`. Es la voz que va a
narrar los anuncios de voz en off.

```
npm run voces
```

Ese comando lista las voces de su cuenta con sus IDs. **Que elija una, y que la
escuche en la web de ElevenLabs antes de decidir** — la voz es identidad de
marca y se nota mucho.

Cuando elija, **edita el `.env` que creaste en el Paso 4** y rellena el campo
que habías dejado vacío:

```
ELEVENLABS_VOICE_ID=<el ID de la voz que eligió>
```

> **Las voces son MULTILINGÜES. No le adviertas nada del idioma.** Una voz que
> ElevenLabs lista como inglesa habla español perfecto, con ñ y con tildes: el
> idioma lo pone el texto que se le manda, no la voz. **Nunca le digas "esa voz
> está en inglés, mejor elige una en español"** — es falso y le hace dudar de una
> elección correcta. Que elija la que más le guste cómo suena, y punto.

> **Los ajustes de la voz (velocidad, estabilidad, estilo) viven en la cuenta de
> ElevenLabs, no aquí.** Se cambian en su web. El sistema los lee y los respeta
> tal cual: si una voz suena rápida, se ajusta allá, no en el proyecto.

En UGC, objeto parlante, podcast y entrevista la voz no sale de aquí: la genera
el video, dentro de cada clip. Este campo es para los estilos con narrador.

---

## Paso 6 — Remotion

Es lo que pega todo y saca el MP4 final. Se instala una sola vez.

```
npm --prefix remotion ci
```

Tarda unos minutos y descarga bastante. Avísale al usuario para que no crea que
se colgó.

Si npm termina con avisos `npm warn allow-scripts ... esbuild ... (postinstall)`,
es normal en las versiones nuevas de npm y **no hay que hacer nada**: Remotion
arma el video igual (probado). Lo que importa es que termine sin `ERR!` y que
`npm run verificar` diga "proyecto de Remotion instalado".

> **Este paso solo hace falta si el usuario quiere el MP4 terminado.** Si
> prefiere generar las imágenes y los videos y montarlos él mismo en CapCut,
> puede saltárselo. Pregúntaselo si quiere ahorrarse la espera. Si lo salta,
> `npm run verificar` lo va a seguir marcando como pendiente ("Casi listo"), y
> está bien: es el único "Casi listo" que se acepta. Si más adelante quiere el
> MP4 terminado, se vuelve a este paso, solo a este.

---

## Paso 7 — Python (solo para entrevista y podcast con el host en la esquina)

**Pregúntale primero** si va a hacer anuncios de entrevista callejera o de
podcast. Si dice que no, sáltate este paso: los avisos de Python que imprime
`npm run verificar` pueden quedar así.

Si dice que sí, hace falta Python 3 con cuatro paquetes: la entrevista los usa
para tapar los huecos de los iconos, y el podcast para recortar al host sin
fondo cuando va en la esquina, sobre el B-roll.

- **Comprueba**: el punto 8 de `npm run verificar` dice si encuentra Python y
  qué paquetes le faltan, con el comando exacto para su máquina.
- **Si falta Python**: que lo descargue de <https://www.python.org/downloads/> y
  lo instale marcando **"Add python.exe to PATH"**. Usar el metodo oficial disponible y autorizado para su equipo. Después, que cierre y vuelva a abrir Codex.
- **Los paquetes** se instalan en un entorno local del proyecto (en Mac: `.venv/bin/python`).
  El diagnostico original puede sugerir `pip --user`: no ejecutar esa sugerencia;
  instalar los paquetes que faltan con el Python de `.venv`, sin `--user`.
  Normalmente es:

  ```
  python -m venv .venv
  .venv/Scripts/python -m pip install rembg onnxruntime pillow numpy
  ```

  Antes de cada comando del motor que use Python (tambien `verificar`), poner
  `.venv/Scripts` al principio del PATH de ese proceso de PowerShell; en Mac/Linux,
  `.venv/bin`. No modificar el PATH global. Si cada herramienta abre un shell
  nuevo, aplicar este entorno en cada llamada: la activacion no se conserva sola.

- **Si va a hacer podcast con el host en la esquina**, comprueba el recorte
  completo con `npm run recortar -- --verificar`. Ese modo también necesita el
  ffmpeg con VP9: el `winget install Gyan.FFmpeg` del Paso 3 ya lo trae.

---

## Paso 8 — Conectar Chrome con Codex

Usar las herramientas de navegador de Codex, no las de Claude.
Con cua_repl, empezar con `await cua.getState()` y leer su documentacion.
Seleccionar el navegador/perfil correcto o crear una pestana de Flow.
Abrir https://labs.google/fx/tools/flow y comprobar el acceso de la cuenta.
Si el navegador no aparece, conectar el navegador mediante la opcion que
ofrezca la aplicacion de Codex del alumno. No inventar nombres de extensiones,
comandos o menús; consultar las instrucciones de su version instalada.
Si hay que otorgar permisos, el alumno los concede en su aplicacion.

### Extension de Chrome y carga de imagenes locales

Para controlar el Chrome habitual se usa la extension oficial de ChatGPT,
conectada con la aplicacion de escritorio. La extension de Claude no sirve
como conexion de esta edicion. El navegador integrado es una alternativa
separada y no comparte automaticamente las sesiones del Chrome habitual.
Guia oficial: https://learn.chatgpt.com/docs/chrome-extension

Para imagenes creadas dentro de Flow, reutilizar su biblioteca sin volver a
subirlas. Si el anuncio usa una referencia local, comprobar esa carga. Si
`fileChooser.setFiles` indica que falta acceso a archivos locales, el alumno
debe abrir `chrome://extensions`, entrar a **Detalles** de **ChatGPT** y activar
**Permitir acceso a URLs de archivo** (Allow access to file URLs).
Ese permiso amplia el acceso de la extension a archivos locales; explicarlo
y dejar que el usuario lo habilite. No activarlo silenciosamente ni sortearlo
con otra tecnica de carga. Reintentar la carga cuando lo confirme.
La prueba del 21 de octubre de 2026 detecto este requisito: poder abrir Flow
no demuestra por si solo que se puedan subir imagenes.


Comprobar que la herramienta documenta carga de archivos y descarga de
resultados. Con la API disponible en esta edicion, `filechooser.setFiles`
carga referencias y el evento `download` devuelve la ruta del archivo.
Usar las instrucciones actuales devueltas por el navegador. No inyectar los
parches antiguos de Claude, no leer tokens y no usar APIs privadas de Flow.
El usuario hace su inicio de sesion/CAPTCHA cuando sea necesario.

## Paso 9 — Comprobar Google Flow

Sin generar medios, verificar sesion, acceso a crear y modelos disponibles.
No poner la marca si falta conexion o Flow no permite crear. Para imagenes
usar Nano Banana 2.1 por defecto y el modelo especifico que declare la cola;
videos Omni 1.1 Flash, con respaldo segun el procedimiento de flow-generacion.
La extension oficial ChatGPT controla Chrome; Computer Use para Windows es
otra capacidad y no sustituye automaticamente una conexion del navegador.
Los nombres de herramientas dependen de la sesion: no prometer que un ZIP
las habilita en todas las instalaciones de Codex.

Una vez comprobado el acceso desde Codex, ejecutar:

```text
npm run verificar -- --flow-listo
```

La marca solo recuerda esta comprobacion; no conecta el navegador y no viaja
con el ZIP. Revisar de nuevo en cada sesion antes de producir.
No gastar creditos ni generar un anuncio para terminar la instalacion.


---

## Paso 10 — Comprobación final

```
npm run verificar
```

Si acabas de correr `npm run verificar -- --flow-listo` y después no cambiaste
nada, vale esa misma salida.

Tiene que terminar en **"Todo listo"**, o en **"Casi listo" solo por Remotion**
si el usuario eligió montar él en CapCut (Paso 6). Los únicos avisos que pueden
quedar son los que el usuario eligió: `KIE_API_KEY` vacía si no quiere música
generada, Python si no va a hacer entrevista ni podcast, y Remotion en ese caso.
Si dice que falta confirmar Chrome y Google Flow, la marca no quedó puesta:
termina los pasos 8 y 9, con su último punto. Si algo más sigue fallando,
resuélvelo antes de dejarlo empezar — un anuncio a medias por una dependencia
que falta cuesta créditos.

La lista del punto 9 ya la comprobaste en los pasos 8 y 9.

Cuando esté todo verde, dile algo así:

> Listo. Ya puedes crear anuncios. Dime qué producto quieres promocionar y con
> cuál de los doce estilos (o con el efecto continuidad), o dime "muéstrame los
> estilos" si quieres verlos primero. Cuando genere las imágenes y los videos
> en Google Flow voy a trabajar en las pestanas del proyecto en Chrome: tú sigue con lo
> tuyo, y no la cierres hasta que te avise.

---

## Si algo se rompe más adelante

- **"no existe el archivo .env"** → Paso 4.
- **"Node.js ... es muy viejo (hace falta 20.12 o superior)"** → Paso 2.
- **"Casi listo: te falta confirmar Chrome, la conexion de navegador de Codex y
  Google Flow"** → solo los pasos 8 y 9, **aunque el `.env` ya exista** (pasa
  cuando el usuario reinició Codex a mitad de la instalación), y al
  terminarlos bien, `npm run verificar -- --flow-listo` (último punto del Paso
  9). Si en esa misma salida `ELEVENLABS_VOICE_ID` sale vacía, haz antes el
  Paso 5: quedó a medias en el mismo corte.
- **"ffmpeg no esta instalado"** → Paso 3, y que reabra Codex.
- **"remotion/ existe pero sin dependencias"** → Paso 6 (si el usuario monta
  en CapCut, puede quedar así).
- **"no encuentro la carpeta de descargas"** o **"FLOW_DESCARGAS apunta a una
  carpeta que no existe"** → Paso 4, la carpeta de descargas: que te diga dónde
  guarda Chrome (Configuración → Descargas → Ubicación) y corriges
  `FLOW_DESCARGAS` en el `.env`.
- **"kie.ai rechazo la clave (401)"** → la clave quedó mal copiada. Que la copie
  otra vez de <https://kie.ai/api-key> y la corriges en el `.env`.
- **"Saldo insuficiente"** en la música o la canción → hay que cargar saldo en
  kie.ai.
- **`npm run musica` dice que kie.ai no está conectado** → pregúntale al usuario
  si lo conecta ahora (Paso 4, kie.ai) o si el anuncio sale sin música de fondo
  (las transiciones van igual). En Zack D Films y skeleton no pregunta: indica
  copiar su pista fija, que no necesita kie.ai. `npm run cancion` sin clave
  explica que en musical e historias musicales no hay opción: hay que
  conectarlo.
- **Python o un paquete que falta** → Paso 7.
- **Codex no ve el navegador** → comprobar las herramientas de la sesion,
  conexion de la extension ChatGPT, perfil correcto y acceso a Flow (Paso 8).
  No repetir toda la instalacion ni borrar `.flow-listo` para reconectar.
- **Se cerro la pestana de Flow** → reabrir `flow/proyecto.txt`, leer
  `flow/estado-codex.json` y comprobar lo ya enviado antes de continuar.
- **Flow rechaza un pedido** ("Es posible que esta generación incumpla nuestras
  políticas") → no es un problema de instalación. Muchas veces es un falso
  positivo: se reintenta el mismo prompt hasta 4 veces y, si sigue, se cambia
  solo lo que puede activar el filtro, sin cambiar la escena, y se anota en
  `temp/<anuncio>/flow/cambios-de-prompt.md`. El procedimiento completo está en
  la skill `flow-generacion`.
- **Una descarga no aparece**:
  - que el usuario abra las descargas de Chrome (`Ctrl + J`): si Chrome bloqueó
    "descargar varios archivos", que lo permita;
  - si Chrome abre una ventana preguntando dónde guardar cada archivo, que
    apague esa opción (Chrome → Configuración → Descargas → "Preguntar dónde se
    guardará cada archivo antes de descargarlo");
  - si Chrome descarga en otra carpeta, ponla en `FLOW_DESCARGAS` en el `.env`
    (`npm run verificar` muestra la que se está usando);
  - `npm run flow:recibir -- temp/<anuncio> --solo-ver` muestra qué encuentra
    sin mover nada, y el resumen de `flow:recibir` dice qué falta y qué se
    rechazó: se descarga o se regenera solo eso (un video, solo con el sí del
    usuario a sus créditos). Registrar el archivo real por ID con `npm run medios:registrar`; no
    regenerar un medio correcto solo por un fallo de descarga.
- **Flow dice que no hay créditos**, o muestra un límite de generaciones → para
  y avísale al usuario. Lo ya generado queda en su proyecto de Flow. Esperar a
  que se renueven o subir de plan es decisión suya.
- **Un comando falla y no sabes por qué** → corre `npm run verificar` primero.
  Casi siempre te dice qué es.
