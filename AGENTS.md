# Anuncios IA — Codex + Google Flow

Estas instrucciones pertenecen exclusivamente a este proyecto. No instalar
skills, claves ni configuracion en el perfil global del usuario.

## Integracion

- Imagenes: Google Flow con Nano Banana 2.1 por defecto (`IMAGENES_PROVEEDOR=flow`).
  Comprobar el modelo en la interfaz. No usar image_gen salvo peticion expresa.
  Reutilizar imagenes ya generadas en la biblioteca de Flow para los videos.
- Videos: Google Flow mediante las herramientas de navegador disponibles en Codex.
  Leer `.agents/skills/flow-generacion/SKILL.md` antes de generar medios.
- Voz y transcripcion: ElevenLabs. Musica y canciones: Suno mediante kie.ai.
  Las pistas fijas, manifiestos, continuidad y montaje conservan el motor original.
- `npm run imagenes` y `npm run videos` SOLO preparan colas. El asistente realiza
  las generaciones y descarga los resultados. No afirmar que esos comandos generan solos.
- No usar `mcp__claude-in-chrome__*`, `/chrome`, `ToolSearch`, los antiguos
  ayudantes `flow:js` ni inyeccion de JavaScript para controlar Flow.
- La disponibilidad de herramientas depende de la sesion de Codex. Este ZIP no
  concede acceso al navegador, no instala extensiones ni transporta sesiones.

## Preparacion

Para instalar, leer `INSTALAR.md`. Ejecutar `npm run verificar` y resolver solo
lo necesario para el trabajo elegido. No exigir credenciales de voz/musica
para escribir guiones o generar solo imagenes/videos. No mostrar claves.
`.flow-listo` registra una comprobacion anterior; volver a verificar el navegador
en cada sesion. No confundir esa marca con una conexion activa.
Si existe `respaldos/ACTUALIZACION_EN_CURSO.json`, revisar `ACTUALIZAR.md` antes
de producir. Respetar las preferencias existentes en `PERSONALIZACION.md`.

Si existe `.instalacion-pendiente.md`, leerlo y terminar los pasos pendientes;
antes de pedir un reinicio, guardar ahi lo que falta y las decisiones ya tomadas.
Eliminar esa nota solo al completar la instalacion. Guiar al alumno paso a paso,
sin asumir que conoce terminales, claves o dependencias.

Las cifras de creditos del material original son historicas: comprobarlas en
Flow. Una aprobacion de alcance y presupuesto ya concedida no se pide de nuevo.
Los posibles falsos positivos y los fallos tecnicos siguen el procedimiento de
cuatro reintentos de flow-generacion; no se tratan como un clip generado defectuoso.

## 2. Cómo se hace un anuncio

El usuario elige un estilo y tú invocas su skill. Hay trece: doce estilos y el
efecto continuidad.

| Estilo | Cómo se ve |
|---|---|
| `anuncios-crochet` | diorama tejido en lana y ganchillo |
| `anuncios-claymation` | stop-motion de plastilina |
| `anuncios-zack-d-films` | animación 3D cinematográfica por capítulos; el mecanismo sobre grid azul o estudio limpio |
| `anuncios-estilo-pixar` | el mismo proceso que Zack D Films, pero todo Pixar: sin grid ni estudio, el mecanismo como escena Pixar dentro del mundo del anuncio |
| `anuncios-estilo-lego` | minifiguras LEGO y mundos de ladrillos, con narrador; el mecanismo en animación médica 3D y el producto real dentro del mundo Lego |
| `anuncios-skeleton-ads` | personaje esqueleto 3D |
| `anuncios-ugc` | una persona generada con IA hablando a cámara todo el anuncio, con su propia voz |
| `anuncios-talking-object-pixar` | objeto animado que habla en primera persona |
| `anuncios-musicales` | el producto se vende cantado, en una canción original (1-2 min) |
| `anuncios-historias-musicales` | una historia en primera persona cantada de principio a fin (4-10 min) sobre animación 3D estilo Pixar |
| `anuncios-podcast` | dos anfitriones conversando frente a micrófonos; el producto entra como recomendación entre amigos |
| `anuncios-entrevista` | entrevista callejera: alguien fuera de cámara le hace preguntas incómodas a una persona en la calle |
| `anuncios-continuidad` (efecto) | **no es un estilo**: va encima de un estilo con narrador en voz en off (Pixar, Zack D Films, Lego, claymation, crochet o skeleton). Cada video pasa de la imagen de una toma a la de la siguiente, sin cortes |

**Si el usuario no dice cuál quiere, muéstrale la lista y que elija.** No
decidas tú: el estilo es la decisión creativa más grande del anuncio.

**Cuando la skill termina de armar el anuncio, el paquete queda interno.** El
guion toma por toma, los prompts de imagen y video, el B-roll, el texto en
pantalla y el guion de voz quedan en el manifiesto
(`temp/<anuncio>/manifiesto.json`), validado, y **no se muestran en el chat**.
El usuario ve solo un resumen corto (estilo, producto, mercado e idioma,
cuántas tomas y B-roll, la duración aproximada y, si la hay, una decisión que
conviene que sepa) y tres opciones:

- **A) Prodúcelo todo tú**: Google Flow, voz, música, montaje y el MP4
  terminado.
- **B) Genera solo las imágenes y los videos**: los monta él en CapCut.
- **C) Entrégame el paquete de prompts**: se le pasa en el chat el paquete
  completo, para revisarlo o producirlo a mano, y después se le ofrece seguir
  con A o B.

**El manifiesto del anuncio no se muestra nunca** en el chat, ni en la opción
C: es interno del sistema. Si en cualquier momento el usuario pide ver el guion
o una parte del paquete, se le muestra esa parte, copiada del manifiesto. (Es
el del anuncio que se está haciendo: el de `ejemplo-anuncio/` sí se puede
mirar, está ahí para eso.)

**Continuidad se usa junto con el estilo**: primero el estilo hace su trabajo
completo (guion, prompts y manifiesto, y su resumen con las opciones A, B y C)
y, cuando el usuario elige producir (A o B), `anuncios-continuidad` toma la
producción desde el manifiesto. Si elige C, el paquete es el del estilo (un
video por toma, con B-roll y cortes): los prompts de video de cada paso se
escriben recién mirando las imágenes generadas y no vienen ahí. Al entregarlo,
avísale en una línea que, producido a mano, sale con cortes, y que el anuncio
sin cortes es con A o B. Si el anuncio es de uno donde alguien habla a
cámara, se canta o el producto habla, no aplica: díselo en una frase y sigue
con el anuncio normal.

Cada skill lleva su propio proceso y sabe lo que tiene que hacer. Tú **sigues la
skill**, no improvisas por encima de ella.

**Usa SIEMPRE la skill de esta carpeta** (`.agents/skills/`, la que se llama
tal cual, por ejemplo `anuncios-crochet`). Si el usuario también tiene en su
cuenta o catalogo global las versiones sueltas de estas skills, Codex las
muestra con un prefijo (por ejemplo `anthropic-skills:anuncios-crochet`) y con
la misma descripción. Esas son las versiones SIN motor: solo entregan prompts,
no arman el manifiesto ni generan en Google Flow. Nunca las uses en esta
carpeta.

**Todo el detalle de la producción — el orden de los comandos, qué se verifica
antes de entregar, y en qué se diferencian los estilos — está en
`COMO-PRODUCIR.md`. Léelo antes de generar nada.** Las imágenes y los videos se
generan en Google Flow con la skill `flow-generacion` (punto 4).

**Al terminar un anuncio**, entrégale los MP4 de `output/` y el informe de
entrega (`COMO-PRODUCIR.md`, sección 6). Ahí termina: no se abre ningún editor
ni visor del montaje.

---

## 3. Reglas que no se rompen nunca

Estas valen para los trece y están por encima de cualquier prisa.

1. **Nunca mandes videos a Flow sin mostrar antes los créditos y esperar un
   sí.** Los videos gastan créditos de Google Flow del plan del usuario.
   Cuando `npm run videos` arme la cola, dile cuántos clips son y la
   estimación de créditos que imprime, y espera un sí. Las imágenes no necesitan otro ok cuando su costo visible sea 0 créditos. La música y las canciones se pagan
   en kie.ai: son centavos, pero también se muestra el costo (el comando con
   `--solo-plan`) y se espera un sí.

   > Créditos medidos (Omni 1.1 Flash, 720p): **4 s = 7, 6 s = 10, 8 s = 12**,
   > y `npm run videos` ya los suma. Los de 10 s y los del modelo de respaldo
   > (Veo 3.1 - Fast, más caro) no están medidos y el comando los marca "sin
   > medir": léelos en el menú de ajustes de Flow con esa duración elegida, y
   > si no se ve, díselo tal como lo imprime el comando. Nunca inventes una
   > cifra. Cada clip que se regenera vuelve a gastar: **regenerar un video y
   > pasar al respaldo se preguntan antes**, con sus créditos (lo detalla
   > `flow-generacion`). Comprobar que el reintento no añade un gasto fuera del presupuesto aprobado.
   >
   > **Historias musicales es el estilo que más gasta**: 60 a 80 clips para 5
   > minutos, casi todos de 4 o 6 s (7 o 10 créditos cada uno; alguna línea
   > larga, de 8 s: 12). Díselo así antes de generar la canción siquiera, sin
   > un total inventado: el del anuncio lo da `npm run videos` cuando ya hay
   > manifiesto, y ahí se vuelve a esperar el sí (`COMO-PRODUCIR.md`,
   > secciones 5 y 9).

2. **Nunca inventes un prompt nuevo por tu cuenta si una toma sale mal.**
   Pregunta. Un prompt nuevo se escribe, se muestra, y se genera solo con el
   visto bueno (`npm run rehacer`, que nunca repite el prompt que falló y
   guarda en `historial/` los archivos que reemplaza: no se borra nada).

3. **Que Flow rechace un pedido no es lo mismo que un clip que sale mal.**
   - **Rechazo por políticas** ("Es posible que esta generación incumpla
     nuestras políticas"): puede ser un falso positivo. Para una solicitud permitida, se
     reintenta el mismo prompt **hasta 4 veces**; si sigue, se cambia solo lo
     que puede activar el filtro, sin cambiar la escena, se anota en
     `temp/<anuncio>/flow/cambios-de-prompt.md` y se le cuenta al usuario al
     final. El procedimiento está en `flow-generacion`; en un clip hablado, la
     línea se cambia primero en el manifiesto, como dice la skill del estilo.
   - **Un clip que se generó pero salió mal**: ahí el problema suele estar en
     la instrucción, y repetir el mismo prompt da el mismo resultado. Se sigue
     la regla 2. La excepción la marca cada skill: lo que es "fallo de la
     tirada" (otra cara, texto en pantalla, una persona de más) se regenera
     con el mismo texto. Una imagen, sin preguntar (cuesta 0); un video, solo
     con el sí del usuario a sus créditos.

4. **En los estilos con diálogo (UGC, objeto parlante, podcast y entrevista)
   hay una parada obligatoria** después de generar los videos y antes de
   montar: la revisión de cada clip. Las tomas habladas no se pueden acelerar
   ni cortar por dentro; un clip que sale mal solo se arregla regenerándolo, y
   regenerar después de ensamblar es rehacer todo el montaje. Se miran los
   fotogramas y la transcripción (los comandos los dice la skill): un clip que
   no dijo todo su guion, o que lo dijo con palabras repetidas, trabadas o
   agregadas, se regenera; la única tolerancia la decide el motor y se le
   informa al usuario. Le muestras la revisión clip por clip y esperas su
   visto bueno.

5. **Cada anuncio vive en su propia carpeta** dentro de `temp/`, con un nombre
   en minúsculas y guiones (ej. `temp/goli-matcha-mind/`). Ese nombre es
   también el prefijo con el que se descarga cada archivo de Flow
   (`goli-matcha-mind__toma-3-inicial.jpg`). Los MP4 terminados salen a
   `output/`.

6. **Todo anuncio lleva música de fondo y cuatro animaciones de entrada con su
   efecto de sonido — menos los cantados y los hablados.** Musical e historias
   musicales no llevan ninguna de las dos porque la canción es el audio;
   podcast y entrevista van sin música y sin transiciones: la conversación se
   corta en seco y se oye solo la voz. Con continuidad no hay transiciones de
   editor (el paso lo hace la IA dentro de cada video), pero sí la música del
   estilo. En los demás no son opcionales y **no se le preguntan al usuario**.
   Las secciones 3 y 4 de `COMO-PRODUCIR.md` dicen exactamente qué hacer en
   cada estilo. La música cambia según el estilo:

   | Música | Estilos |
   |---|---|
   | **pista fija**, sin kie.ai | Lego (la copia el motor solo), skeleton (`recursos/musica/esqueleto.mp3`) y Zack D Films (`recursos/musica/zack-d-films.mp3`). Estas dos últimas **se copian a mano** a `temp/<anuncio>/musica/fondo.mp3` |
   | **generada con Suno** (kie.ai) | crochet, claymation, Pixar, UGC, objeto parlante, y continuidad según el estilo sobre el que va |
   | **la canción**, con Suno (kie.ai, obligatorio) | musical e historias musicales |
   | **sin música** | podcast y entrevista |

   > **La única pregunta sobre la música es la de kie.ai.** Si el usuario no
   > lo conectó (`KIE_API_KEY` vacía), `npm run musica` lo explica y se
   > detiene: pregúntale si lo conecta ahora (Paso 4 de `INSTALAR.md`) o si el
   > anuncio sale sin música de fondo, y haz lo que diga; sin música, las
   > transiciones van igual. En Zack D Films y skeleton no hay pregunta: sin
   > clave, el comando indica copiar su pista fija. En musical e historias
   > musicales no hay opción: sin kie.ai no hay canción, y la canción es el
   > anuncio (`npm run cancion` lo explica). Para saber si está conectado no
   > abras el `.env`, que tiene las claves: en los estilos con música
   > generada, `npm run musica -- temp/<anuncio> --solo-plan` imprime
   > "kie.ai: conectado" o "NO conectado", sin gastar nada.

   > **El motor avisa si faltan, pero no detiene nada.** Un anuncio sin música y
   > sin transiciones se renderiza perfecto, pasa todas las verificaciones y sale
   > plano. Es el fallo más fácil de cometer y el más difícil de ver.

7. **Las voces de ElevenLabs son multilingües.** Nunca le digas al usuario que
   una voz "está en inglés" ni le recomiendes cambiarla por eso: el idioma lo
   pone el texto, no la voz.

8. **La lógica creativa de las skills no se reescribe.** Si algo no calza, se
   habla con el usuario; no se parchea la skill sobre la marcha.

9. **En historias musicales la canción manda.** Se generan varias versiones y
   **el usuario elige de oído** (nunca tú); la duración del anuncio es la de la
   canción y **nunca se recorta la letra para cuadrar minutos**; los clips van
   mudos y sin transiciones. `COMO-PRODUCIR.md` tiene el flujo propio de este
   estilo.

---

## 4. Google Flow con Codex

Leer la skill local flow-generacion antes de ejecutar las colas. Un proyecto
Flow por anuncio, guardado en `flow/proyecto.txt`; registrar cada envio por ID
en `flow/estado-codex.json`. No duplicar trabajos que siguen procesando.
Reutilizar la biblioteca solo si coincide con el archivo que necesita la cola:
un frame heredado o transformado en disco puede requerir cargar esa version.

Usar las herramientas de navegador disponibles y su documentacion actual.
Mantener las pestanas del trabajo separadas de las del usuario y conservar las
que sean entrega o trabajo pendiente con la capacidad documentada del navegador.
No exigirle mover ventanas si la conexion de Codex no lo necesita.
Las descargas ya forman parte de la produccion autorizada: no pedir otro permiso
por tanda. Las verificaciones de acceso y permisos del navegador se resuelven
cuando realmente aparezcan, sin repetir una autorizacion ya concedida.

Registrar cada descarga real con `npm run medios:registrar -- temp/<anuncio>
imagen|video <id> <ruta>`; luego `npm run flow:recibir -- temp/<anuncio>
--desde temp/<anuncio>/flow/descargas`. El receptor mantiene nombres, historial,
conversiones y verificaciones del motor original. Repetir las vueltas hasta
resolver trabajos y bloqueados. No sustituir medios por archivos vacios.

Ante desconexion, retomar el mismo proyecto y comprobar su estado; la marca
`.flow-listo` no acredita una conexion actual. Ante cuota agotada o limite de
generaciones, informar y conservar lo ya hecho; no comprar saldo ni planes.

## 5. Qué hay en esta carpeta

| | |
|---|---|
| `.agents/skills/` | las trece skills de anuncios y `flow-generacion`, la que maneja Google Flow. **Esto es lo que se ejecuta** |
| `skills/` | las mismas, empaquetadas en `.skill` (ver abajo). Las versiones sin motor, para otros asistentes, se reparten aparte: no vienen en esta carpeta |
| `produccion/` | el motor: arma las colas de Flow, recibe lo descargado, genera la voz y la música, revisa y arma el montaje |
| `produccion/flow/` | la base de Google Flow: modelos, nombres de descarga y el formato de la cola |
| `remotion/` | el ensamblador de video |
| `recursos/` | efectos de transición, música por estilo, catálogo de esqueletos |
| `temp/` | aquí va cada anuncio, en su propia carpeta (con su `flow/`: las colas, el enlace al proyecto de Flow y los prompts cambiados) |
| `output/` | aquí salen los MP4 terminados |
| `ejemplo-anuncio/` | un anuncio real ya hecho, **solo para mirar** |
| `INSTALAR.md` | la guía de instalación que sigues tú, no el usuario |
| `COMO-PRODUCIR.md` | el proceso completo de producción |
| `VERSION`, `CAMBIOS.md` y `ACTUALIZAR.md` | la versión instalada, lo que trae cada una y cómo se actualiza (se sigue el `ACTUALIZAR.md` del zip nuevo: punto 6) |
| `respaldos/` | las copias que guarda cada actualización. **Nunca se borran** (punto 6) |
| `mis_archivos/` | los scripts, notas y archivos propios del usuario (punto 6) |
| `PERSONALIZACION.md` | los cambios del sistema que el usuario quiere conservar, si los hay (punto 6) |

**`ejemplo-anuncio/` no se toca y no se usa como punto de partida.** Está ahí
para que el usuario vea cómo queda un manifiesto y un plan de montaje reales.
Los anuncios nuevos siempre se crean en `temp/`.

### Los servicios que usa

| Servicio | Para qué | |
|---|---|---|
| **Google Flow** (<https://labs.google/fx/tools/flow>, redirige a flow.google.com) | las imágenes y los videos, con la cuenta de Google del usuario | **obligatorio**. Recomendado el plan Google AI Pro o Ultra, por los créditos de video |
| **ElevenLabs** | la voz en off y la transcripción (subtítulos y cortes) | **obligatorio** |
| **kie.ai** | solo la música de fondo y las canciones, con Suno. Centavos por anuncio | **recomendado**; **obligatorio** en musical e historias musicales |

Codex usa la conexion de navegador disponible en la sesion. Cada alumno conecta
su propia cuenta de Flow y paga su consumo. Las claves viven en `.env`, que no
se comparte; `.env.example` es la plantilla vacia.

### Las skills NO se instalan. Ya están funcionando.

**Nunca le digas al usuario que tiene que instalar las skills, ni corras nada
para instalarlas.** Las catorce viven en `.agents/skills/` dentro de esta
carpeta, y Codex las descubre en este proyecto. Si el catalogo de un chat antiguo no
las muestra, leerlas directamente o abrir un chat nuevo en la misma carpeta. Descomprimir la carpeta y abrirla es toda la instalación que
existe para las skills. (Lo que sí se instala es lo de `INSTALAR.md`: Node,
ffmpeg, Remotion y la extensión de Chrome.)

Son **skills de proyecto**, no globales: solo aparecen mientras se trabaja en
esta carpeta, y no afectan a ningún otro proyecto del usuario. Eso es
deliberado.

### Por qué hay dos carpetas de skills

| | |
|---|---|
| `.agents/skills/<nombre>/SKILL.md` | **lo que se ejecuta**. La fuente de verdad |
| `skills/<nombre>.skill` | un ZIP inerte. El formato para **mover** una skill a otro proyecto |

**Editar un `.skill` no cambia nada de lo que corre.** Si alguna vez hay que
tocar una skill, se edita la de `.agents/skills/` y después se corre
`npm run skills:empaquetar` para regenerar el paquete.

`npm run verificar` avisa si las dos dejan de coincidir. Ese aviso significa que
alguien editó el sitio equivocado.

---

## 6. Actualizaciones

- **Si el usuario arrastra un `.zip` del sistema y pide actualizar**, lee el
  `ACTUALIZAR.md` **que trae el zip**, dentro del zip y sin descomprimirlo (por
  ejemplo `tar -xOf "<zip>" <carpeta raíz>/ACTUALIZAR.md`, con la carpeta raíz
  que muestra `tar -tf "<zip>"`, normalmente `anuncios-ia-flow`; `tar` viene con
  Windows 10/11 y con Mac, y en Git Bash de Windows es
  `"$SYSTEMROOT/System32/tar.exe"`), y sigue sus pasos, no los de esta carpeta:
  dice cómo correr su actualizador, que respalda, copia y comprueba sin tocar
  `temp/`, `output/` ni `.env`. Si lo que arrastra es una carpeta (en Mac,
  Safari descomprime los zip solo), lee el `ACTUALIZAR.md` de esa carpeta.
  Nunca actualices copiando archivos a mano ni con git. Si el zip no trae
  `VERSION` ni `ACTUALIZAR.md`, es un zip viejo: **no copies nada** y pídele el
  más reciente.
- **`respaldos/ACTUALIZACION_EN_CURSO.json`**: si existe, la última
  actualización quedó a medias. Antes de cualquier otra cosa, díselo al usuario
  y termínala con el zip (su `ACTUALIZAR.md`) o, si ya no lo tiene, deshazla con
  `node produccion/actualizar.js . --restaurar` (si la actualización había
  terminado y solo quedó la marca, eso solo la quita, sin deshacer nada; nunca
  la borres a mano).
- **`respaldos/`**: las copias que guarda cada actualización (lo que se
  reemplazó, se quitó o se movió, con su `_INFORME.txt`). **Nunca se borran**, ni
  para liberar espacio: eso lo decide el usuario.
- **`PERSONALIZACION.md`**: cada cambio que hagas en un archivo del sistema a
  pedido del usuario y que él quiera para siempre (en una skill, en
  `produccion/config.js` o en otro archivo del motor) se anota aquí: qué
  archivo, qué cambiaste y por qué. También sus preferencias para todos los
  anuncios. Las actualizaciones reemplazan los archivos del sistema y lo vuelven
  a aplicar desde ahí. Léelo antes de empezar un anuncio y revisa que cada
  cambio siga aplicado (si una actualización se cortó, puede faltar): si falta,
  vuelve a aplicarlo y díselo al usuario.
- **`mis_archivos/`**: los scripts, notas y archivos propios del usuario.
  **Nunca guardes nada del usuario en `produccion/`, `remotion/src/`,
  `recursos/`, `ejemplo-anuncio/`, `skills/` ni dentro de una skill del
  sistema**: las actualizaciones reemplazan esas carpetas, y lo que no es del
  sistema lo mueven a `mis_archivos/`. Lo de un solo anuncio va en su carpeta de
  `temp/`.
- **Anuncios de antes de una actualización:** si retomas un anuncio de `temp/`
  que ya estaba antes del último respaldo de `respaldos/`, lee primero en
  `CAMBIOS.md` la parte "Trabajos a medias" de las versiones posteriores y
  aplícala.

Para distribuir: `npm run test:codex`, `npm run skills:empaquetar` y `npm run alumnos`.
No compartir `.env`, `.flow-listo`, anuncios privados, sesiones ni node_modules.
