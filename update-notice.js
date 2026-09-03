/* ===== AI APPs · Aviso de "hay una versión nueva" =====
   Todas las páginas (hub y apps) cargan este archivo. Su único trabajo:
   darse cuenta de que se publicó una versión nueva del sitio MIENTRAS la
   persona tenía la pestaña abierta, y avisarle con un banner arriba para
   que recargue — si no, sigue usando la versión vieja sin enterarse.

   Cómo lo sabe: build.sh escribe /version.json con el identificador de la
   compilación. Al cargar la página se guarda ese valor como referencia, y
   cada tanto se vuelve a pedir. Si cambió, es que hubo un despliegue nuevo.

   Si /version.json no existe (sitio viejo, o abrir el HTML con doble clic
   desde el disco), el archivo no hace absolutamente nada: ni banner, ni
   errores en consola. */
(function () {
  "use strict";

  var VERSION_URL = "/version.json";
  /* Cada 5 minutos. Los archivos estáticos del Worker no consumen la cuota
     de peticiones del plan gratuito (ver wrangler.toml), y aun así se pide
     un archivo de ~60 bytes. */
  var POLL_MS = 5 * 60 * 1000;
  /* Al volver a la pestaña también se revisa, pero no más de una vez por
     minuto: cambiar de ventana muchas veces seguidas no debe disparar una
     petición por cada cambio. */
  var MIN_GAP_MS = 60 * 1000;

  /* Abierto desde el disco (file://) no hay servidor al que preguntarle. */
  if (location.protocol !== "http:" && location.protocol !== "https:") return;
  if (typeof fetch !== "function") return;

  var baseVersion = null;    // la versión con la que se cargó esta pestaña
  var dismissedVersion = null; // la última que la persona cerró con la "x"
  var lastCheck = 0;
  var host = null;

  function readVersion() {
    return fetch(VERSION_URL, { cache: "no-store", credentials: "omit" })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data.version !== "string" || !data.version) return null;
        return data.version;
      })
      .catch(function () {
        /* Sin conexión, o el archivo no existe: no es un error que le
           importe a la persona. Se reintenta en la siguiente vuelta. */
        return null;
      });
  }

  function check() {
    lastCheck = Date.now();
    return readVersion().then(function (version) {
      if (!version) return;
      if (version === baseVersion) return;
      if (version === dismissedVersion) return;
      showBanner();
    });
  }

  function scheduleChecks() {
    setInterval(check, POLL_MS);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheck < MIN_GAP_MS) return;
      check();
    });
  }

  /* El banner vive en un shadow DOM, igual que el widget de cuenta: las 6
     páginas traen su propio CSS y ninguna puede pisar estos estilos (ni al
     revés). */
  function showBanner() {
    if (host) return;

    host = document.createElement("div");
    host.id = "aiapps-update-notice";
    /* pointer-events:none en el contenedor y auto solo en la barra: el resto
       de la franja superior sigue siendo de la app, así el banner no puede
       dejar inservible un botón que quede debajo.
       --aiapps-chrome-top es el escape para una app que algún día tenga algo
       propio pegado arriba; acotado con min() para que un valor grande no
       empuje el banner fuera de la pantalla (es position:fixed, no hay
       scroll que lo recupere). Mismo criterio que el widget de cuenta. */
    host.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:2147483645;" +
      "display:flex;justify-content:center;pointer-events:none;" +
      "padding:calc(8px + min(var(--aiapps-chrome-top, 0px), 30vh)) 10px 0;";

    var shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML =
      '<style>' +
      ':host{ font-family:system-ui,-apple-system,"Segoe UI",sans-serif; }' +
      '.bar{' +
      '  pointer-events:auto;' +
      '  display:flex; align-items:center; gap:10px; flex-wrap:wrap;' +
      '  justify-content:center;' +
      '  max-width:min(560px, 100%); box-sizing:border-box;' +
      '  background:#1B2430; color:#F1EDE4;' +
      '  border:1px solid rgba(255,255,255,0.14); border-radius:999px;' +
      '  padding:9px 10px 9px 16px;' +
      '  box-shadow:0 10px 28px rgba(0,0,0,0.38);' +
      '  font-size:13px; line-height:1.35;' +
      '  animation:aiapps-drop .32s ease-out;' +
      '}' +
      '@keyframes aiapps-drop{ from{ transform:translateY(-14px); opacity:0; } to{ transform:none; opacity:1; } }' +
      '@media (prefers-reduced-motion: reduce){ .bar{ animation:none; } }' +
      '.text{ flex:1 1 auto; min-width:0; }' +
      'button{ font:inherit; cursor:pointer; border-radius:999px; flex:0 0 auto; }' +
      /* Texto oscuro sobre el dorado: en blanco el contraste queda en 3.2:1 y
         no pasa el mínimo de accesibilidad; así queda en 4.8:1. */
      '.reload{ background:#B8863B; color:#1B2430; border:none; font-weight:600;' +
      '  padding:7px 15px; font-size:12.5px; }' +
      '.reload:hover{ background:#C9974A; }' +
      '.close{ background:transparent; color:#F1EDE4; border:1px solid rgba(255,255,255,0.22);' +
      '  width:28px; height:28px; padding:0; font-size:15px; line-height:1; }' +
      '.close:hover{ background:rgba(255,255,255,0.10); }' +
      'button:focus-visible{ outline:2px solid #F1EDE4; outline-offset:2px; }' +
      '</style>' +
      '<div class="bar" role="status" aria-live="polite">' +
      '  <span class="text">New updates in the platform, please refresh</span>' +
      '  <button type="button" class="reload">Refresh</button>' +
      '  <button type="button" class="close" aria-label="Dismiss this notice" title="Dismiss">&#215;</button>' +
      '</div>';

    shadow.querySelector(".reload").addEventListener("click", function () {
      location.reload();
    });
    shadow.querySelector(".close").addEventListener("click", function () {
      /* Se recuerda cuál se cerró: el banner no vuelve a salir por esta misma
         versión, pero sí si más tarde se publica otra. */
      readVersion().then(function (version) {
        dismissedVersion = version || baseVersion;
        hideBanner();
      });
    });

    document.body.appendChild(host);
  }

  function hideBanner() {
    if (!host) return;
    host.remove();
    host = null;
  }

  function start() {
    readVersion().then(function (version) {
      /* Sin referencia inicial no hay nada con qué comparar: el sitio no
         publica version.json todavía. Se queda callado y no reintenta. */
      if (!version) return;
      baseVersion = version;
      lastCheck = Date.now();
      scheduleChecks();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
