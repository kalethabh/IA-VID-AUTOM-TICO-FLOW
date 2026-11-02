# Actualizar el sistema a una versión nueva

## Para el alumno
1. Si se está generando algo (imágenes o videos en Flow, la voz, la música o el video final), **espera a que
   termine** y **cierra las otras ventanas** de Codex.
2. Descarga el `.zip` nuevo. **No lo descomprimas tú** ni lo pongas dentro de tu carpeta. En Mac, si la descarga
   quedó como carpeta (Safari descomprime los zip solo), usa esa carpeta en lugar del zip, sin meterla dentro de la
   tuya.
3. Abre en Codex **tu** carpeta del sistema (la que tiene tus anuncios en `temp/`), arrastra el zip (o esa
   carpeta) al chat y escribe:

   > Actualiza el sistema con esta versión nueva: lee el ACTUALIZAR.md que trae y síguelo.

4. Codex te pedirá **los permisos necesarios** para descomprimir, copiar o instalar. No se
   repiten autorizaciones ya concedidas; los permisos dependen de su configuracion. Si se corta a la mitad,
   **vuelve a arrastrar el zip (o la carpeta) y escribe lo mismo**: si se cortó mientras copiaba los archivos, Codex
   primero deja todo como estaba y después hace la actualización completa; si ya los había copiado, solo termina lo
   que faltaba.
5. Al final, **abre una conversación nueva**.

Tus anuncios, tus videos y tus claves no se tocan. Todo lo que se reemplaza queda guardado en `respaldos/`.

---

## Para Codex
Sigue los pasos en orden, sin saltarte ninguno. La parte mecánica la hace el **actualizador**
(`produccion/actualizar.js` de la versión nueva): revisa, respalda, copia, comprueba y, si algo falla o se corta,
deja el proyecto como estaba. **Tú no copias, no mueves y no borras archivos a mano.**

### 1. Descomprimir aparte
- Leer este documento dentro del ZIP nuevo antes de actuar. El destino es el
  proyecto del alumno con `.env` y `temp/`, nunca la copia nueva.
- Extraer el ZIP a una carpeta temporal NUEVA y unica fuera del destino, sin
  borrar directorios de otros intentos. Comprobar rutas internas y que ninguna
  salga de esa carpeta. Si el usuario entrega una carpeta ya extraida, usarla
  sin borrarla y comprobar que queda fuera del proyecto destino.
- Identificar la raiz con `VERSION`, `AGENTS.md`, `ACTUALIZAR.md` y
  `produccion/actualizar.js`. Si faltan, no copiar nada.
- Esta edicion actualiza proyectos Codex con AGENTS.md. No ejecutar el
  actualizador antiguo de Claude sobre ella. Una migracion desde Claude requiere
  tratar sus rutas por separado, no copiar carpetas encima ni adivinar el destino.

### 2. Prohibido durante la actualización
- Cualquier comando de **git** (`checkout`, `reset`, `clean`, `stash`, `restore`, `pull`, `commit`): git no se usa
  para actualizar. `git clean` borra `PERSONALIZACION.md`, y con `-x` también `temp/`, `output/`, `respaldos/`,
  `mis_archivos/` y `.env`.
- `robocopy`, `xcopy`, `rsync`, `Copy-Item -Recurse`, `cp -r` o copiar carpetas enteras encima del proyecto, también
  con el Explorador.
- Borrar, mover o renombrar las cosas del usuario: `temp/`, `output/`, `respaldos/`, `mis_archivos/`, `.env`,
  `PERSONALIZACION.md`, `.flow-listo`, `.instalacion-pendiente.md`, `remotion/node_modules/`, `.codex/` y `.claude/` si existe (las
  skills de `.agents/skills/` las actualiza el programa, no tú).
- Editar a mano archivos del sistema mientras actualizas: lo que el usuario había cambiado se vuelve a aplicar en el
  paso 6.
- Cerrar procesos del usuario: un render del video o una generación en curso (voz, música) pueden estar a medias o
  ya pagados. Tampoco toques el Chrome ni la pestaña de Flow.

### 3. Correr el actualizador
Las dos rutas van entre comillas y sin barra al final.
1. Primero, **sin cambiar nada**:
   `node "<versión nueva>/produccion/actualizar.js" "<proyecto>" --probar`
   - Muestra de qué versión a cuál se actualiza y qué va a hacer.
   - En el `CAMBIOS.md` **de la versión nueva**, lee las versiones más nuevas que la instalada: las usas en los pasos
     5 y 7.
2. Después, **de verdad**: el mismo comando sin `--probar`.

Cómo terminó (el código de salida; en PowerShell, `$LASTEXITCODE`):
- **0: listo.** Pasa al paso 4 con el informe que imprimió (empieza con `ACTUALIZACION LISTA`; también queda en
  `_INFORME.txt`, dentro del respaldo).
- **0 y "ya esta al dia":**
  - si además nombra un **`INFORME`** (`respaldos/…/_INFORME.txt`), la actualización ya se hizo, pero la conversación
    pudo cortarse antes de terminar los pasos 4 a 7. **Sigue desde el paso 4 con ese informe** (la versión de antes
    es la que dice su primera línea: "de … a …") y haz solo lo que falte: lo que ya está hecho (librerías
    instaladas, cambios ya aplicados) no se repite. Si en esta misma conversación ya hiciste los pasos 4 a 7 de esa
    actualización, no los repitas: ve al informe corto del paso 7;
  - si no nombra ningún informe, díselo al usuario y salta al paso 8.
- **2: no cambió nada** (`NO SE ACTUALIZO`). Dice por qué; explícaselo al usuario en palabras simples:
  - **hay un proceso del sistema corriendo:** que espere a que termine y cierre las otras ventanas de Codex, y
    vuelve a intentar. Usa `--sin-procesos` solo si el usuario confirma que no se está generando nada en esta carpeta
    (el proceso es de otra copia del sistema);
  - **no es la carpeta del sistema o no está instalado:** pregúntale dónde está la carpeta con sus anuncios en
    `temp/` y su `.env`. Si no la tiene, no hay nada que actualizar: primero va `INSTALAR.md`;
  - **la carpeta temporal, la versión nueva o una copia de trabajo separada del proyecto (un worktree):** le
    pasaste mal el proyecto. Es la carpeta original del usuario, abierta en Codex, nunca la que descomprimiste.
    Si lo que está abierto en Codex es la versión descomprimida, que el usuario abra su carpeta y vuelva a
    empezar;
  - **la versión nueva está dentro del proyecto:** tiene que quedar fuera. Si es la carpeta que descargó el usuario,
    pídele que la saque de su carpeta (o que te pase el zip); si la descomprimiste tú ahí, esa copia no se usa (se
    borra en el paso 8). Después, repite desde el paso 1;
  - **el zip es del otro sistema** (la versión por API y la de Google Flow son dos sistemas distintos): pídele el
    zip de la suya;
  - **zip viejo o incompleto:** pídele el más reciente, o que lo vuelva a descargar;
  - **falta espacio:** que lo libere él. Tú no borras nada;
  - **no se pudo leer un archivo o hacer el respaldo:** lo tiene abierto otro programa (OneDrive, el Explorador, otra
    ventana de Codex): que lo cierre, y vuelve a intentar.
- **1: algo salió mal.** Dile al usuario qué pasó con lo que imprime y, según lo que dice:
  - **`FALLO la actualizacion`** y **`El proyecto quedo como estaba`:** no se perdió nada. Si el motivo es un archivo
    abierto en otro programa, que lo cierre, y vuelve a intentar;
  - **la restauración no quedó completa:** también dice qué archivos faltan. Pídele al usuario que cierre lo que los
    tenga abiertos y, antes de cualquier otra cosa, corre
    `node "<versión nueva>/produccion/actualizar.js" "<proyecto>" --restaurar` (si ya no está la versión nueva, sirve
    el del propio proyecto: `node produccion/actualizar.js . --restaurar`). Mientras tanto no se genera nada;
  - **`ERROR inesperado del actualizador`:** un error del programa. Si existe `respaldos/ACTUALIZACION_EN_CURSO.json`,
    corre el mismo comando con `--restaurar` antes de cualquier otra cosa; si no existe, no se cambió nada. Pásale al
    usuario el mensaje tal cual para quien le dio el sistema.
- **No se puede deshacer:** dice `No se puede deshacer del todo` (alguien borró archivos de `respaldos/`) o
  `No se puede deshacer la actualizacion a medias: respaldos/ACTUALIZACION_EN_CURSO.json esta danada`. Con el zip
  nuevo, el actualizador **sigue hacia adelante solo** (`Se sigue hacia adelante`): devuelve lo que puede, aparta
  la marca vieja y hace la actualización con un respaldo nuevo (termina en `ACTUALIZACION LISTA`). Si lo dijo con
  `--restaurar` (sigue con `Para terminar, actualiza con el zip`), corre la actualización con el zip, como en el
  punto 2. `--probar` lo avisa antes, sin cambiar nada.
- **`habia terminado bien: solo quedaba su marca`:** una actualización anterior terminó, pero no se pudo quitar su
  marca. Ya se quitó, sin deshacer nada: sigue con lo que imprime después.
- **Si se cortó** (se cerró la ventana, se negó un permiso), vuelve a correrlo: primero deja todo como estaba y
  después actualiza.
- **`--restaurar --probar`** dice qué desharía, sin cambiar nada.
- **Avisos** (no frenan):
  - si `--probar` dice que **no se pudo revisar si hay procesos** del sistema corriendo, pregúntale al usuario si se
    está generando algo en esta carpeta antes de correrlo de verdad;
  - si al final avisa que **no se pudo quitar `respaldos/ACTUALIZACION_EN_CURSO.json`**, la actualización sí quedó
    hecha. **No borres ese archivo a mano:** pídele que cierre lo que tenga abierta la carpeta (OneDrive, el
    Explorador, otra ventana de Codex) y corre `node produccion/actualizar.js . --restaurar` en el proyecto: ve
    que la actualización terminó y solo quita la marca, sin deshacer nada.

### 4. Instalar
- Si el informe trae líneas **`INSTALAR:`**, corre tal cual todo lo que sigue a `INSTALAR: ` (la línea termina en el
  comando, por ejemplo `npm install --prefix "…\remotion"`; el motivo va en la línea de antes). Tarda unos minutos.
- Si en su lugar trae la nota `Remotion no esta instalado en esta carpeta`, el usuario monta en CapCut o nunca lo
  instaló: no lo instales por tu cuenta. Pregúntale en una línea si quiere el MP4 terminado: si dice que sí,
  instálalo con el Paso 6 de `INSTALAR.md` (el comando es el que trae la nota); si monta en CapCut, no hace falta
  nada.

### 5. Lo que pide cada versión
- En el `CAMBIOS.md` nuevo, lee **todas** las versiones más nuevas que la instalada, **de la más vieja a la más
  nueva**, y haz sus "Para instalar" en ese orden. Si una contradice a otra, manda la más nueva.
- Nada de eso toca `temp/`, `output/` ni `.env`. Lo de "Trabajos a medias" se hace al retomar cada anuncio, no
  ahora.

### 6. Ponerte al día
- Lee **completo** el `AGENTS.md` nuevo: desde ahora sigues ese (y lo que manda leer, como `COMO-PRODUCIR.md` antes
  de producir).
- **Tu memoria:** corrige o borra solo las notas sobre **cómo funcionaba el sistema** (comandos, pasos, archivos)
  que el `AGENTS.md` nuevo cambia; por ejemplo, desde el 2026-10-17 ya no existe `npm run estudio`. **Las
  preferencias del usuario se quedan** (su marca, su idioma, su voz, el estilo que prefiere, cómo quiere la entrega):
  si chocan con un valor por defecto nuevo, **manda la del usuario**.
- **`PERSONALIZACION.md`** (si existe): vuelve a aplicar cada cambio que lista sobre la versión nueva, en el archivo
  que dice. Si el archivo cambió de lugar o de forma, búscalo con el `AGENTS.md` nuevo. Si un cambio ya está
  aplicado, no lo repitas. Si nombra un archivo que el informe movió a `mis_archivos/` ("Movidos a mis_archivos/"),
  no lo devuelvas: corrige su ruta en `PERSONALIZACION.md` (`mis_archivos/<la ruta de antes>`); lo de
  `mis_archivos/` nunca vuelve a una carpeta del sistema.
- **"CAMBIADO A MANO"** en el informe: el usuario había cambiado ese archivo. El respaldo guarda **su** archivo, no el
  original, así que la diferencia con el nuevo mezcla dos cosas:
  - lo que cambió la **versión nueva** (lo dice `CAMBIOS.md`): eso se queda como viene;
  - lo que cambió **el usuario**: lo anotado en `PERSONALIZACION.md` o en comentarios del código. Si no puedes
    separarlo, pregúntale qué había pedido.
- Si el informe dice **`Antes de esta hubo una actualizacion cortada`**, compara también con los nuevos los archivos
  del respaldo viejo que nombra: un cambio del usuario que se pisó antes del corte no sale como `CAMBIADO A MANO`.
  Trátalo igual que esos.
- Si ese cambio del usuario ya está en `PERSONALIZACION.md`, ya lo aplicaste en el punto anterior: **solo díselo**.
  Por los que no estén anotados, explícale cada uno en palabras simples y pregúntale **uno por uno** si lo vuelves a
  aplicar. Lo que vuelvas a aplicar, anótalo en `PERSONALIZACION.md`: qué archivo, qué cambiaste y por qué. Si
  vuelves a aplicar un cambio en una skill (`.agents/skills/<skill>/SKILL.md`), después corre
  `npm run skills:empaquetar`.
- **"Movidos a mis_archivos/"**: eran del usuario (scripts, notas o archivos que estaban en `produccion/`,
  `remotion/src/`, `recursos/`, `ejemplo-anuncio/`, `skills/` o dentro de una skill del sistema). Díselo. Si los usaba
  para algo, ofrécele adaptarlos a la versión nueva; se quedan en `mis_archivos/`, nunca vuelven a una carpeta del
  sistema.
- **"Skills propias"**: son skills suyas, no del sistema, y no se tocaron. Si usan comandos que la versión nueva
  cambió, ofrécele adaptarlas.
- **"Quitados"**: eran del sistema y la versión nueva ya no los trae (están en el respaldo). Díselo en una línea.
- Al final, comprueba que todo funciona: `npm run verificar`. Si marca una skill con `FALTA` (lo que se ejecuta no es
  lo que dice su `.skill`), `npm run skills` muestra el detalle: lo bueno es `.agents/skills/`, y se alinea con
  `npm run skills:empaquetar`. Si marca otra cosa que antes funcionaba, resuélvela con su paso de `INSTALAR.md`. Si
  termina en `Casi listo` solo por Remotion (`instalar Remotion (punto 5)`) y el usuario monta en CapCut, está bien
  así.

### 7. Informe para el usuario
Corto y en palabras simples:
- de qué versión a qué versión se actualizó y lo principal que trae (de `CAMBIOS.md`);
- que sus anuncios, sus videos y sus claves siguen intactos, con los números del informe ("Tus datos, igual que
  antes": cuántas carpetas de anuncio en `temp/` y cuántos videos en `output/`);
- qué se instaló, qué se quitó o se movió y qué cambios suyos volviste a aplicar;
- dónde quedó el respaldo (`respaldos/…`);
- sus anuncios sin terminar, si el informe trae la línea
  `Anuncios de temp/ sin su video en output/ (a medias, o terminados fuera del sistema, por ejemplo en CapCut)`: el
  informe no sabe cuáles terminó fuera del sistema (montados en CapCut, o con el video con otro nombre), así que
  **pregúntale** en una línea cuáles siguen a medias, o acláraselo así. Debajo van las notas que les tocan, copiadas
  de "Trabajos a medias" de `CAMBIOS.md` (por ejemplo, si venía del 2026-10-16, cómo retomar una tanda de Flow a
  medias): dile que las aplicarás al retomar cada anuncio. Si no trae notas debajo, no hay nada especial que
  aplicar: díselo así;
- que **abra una conversación nueva** de Codex en esta carpeta, para que las instrucciones nuevas se carguen
  solas.

### 8. Limpiar
Solo limpiar la carpeta temporal unica que creaste al extraer este ZIP, despues
de verificar su ruta absoluta y que contiene esa extraccion. No borrar el ZIP,
la carpeta entregada por el usuario, sus respaldos ni otros temporales. En
Windows usar un unico shell y Remove-Item con LiteralPath para una ruta validada.
