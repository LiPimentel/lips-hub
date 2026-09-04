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

  /* ===== Dónde empieza el banner =====
     Poner el banner "arriba" a secas lo dejaba encima de la barra de la app:
     medido, en Bitácora del Mentor tapaba por completo la pestaña "Mentoría"
     y un clic en ese punto recargaba la página en vez de cambiar de pestaña.
     Cada página declara en `window.AIAPPS_TOPBAR` el selector de SU barra
     superior y aquí se mide en vivo dónde termina, en lugar de fijar píxeles
     que se romperían con el diseño adaptable de cada app.

     Se mide en cada aparición, y también al hacer scroll y al cambiar el
     tamaño de la ventana: una barra en flujo normal se va hacia arriba al
     bajar la página (su `bottom` se vuelve negativo) y entonces el banner
     sube solo hasta el borde; una barra `sticky`/`fixed` se queda, y el
     banner se queda debajo de ella. */
  var GAP = 8;

  function topOffset() {
    var extra = 0;
    var sel = window.AIAPPS_TOPBAR;
    if (sel) {
      var els;
      try {
        els = document.querySelectorAll(sel);
      } catch (e) {
        els = [];
      }
      /* Franja horizontal que ocupa de verdad la píldora. Antes se suponía
         "el centro ±120px" y se quedaba corto: en Bitácora a 900px el buscador
         asomaba por el borde izquierdo de la píldora y no se contaba. */
      var barra = host.shadowRoot.querySelector(".bar");
      var rb = barra ? barra.getBoundingClientRect() : null;
      var izq = rb ? rb.left : window.innerWidth / 2;
      var der = rb ? rb.right : window.innerWidth / 2;
      var limite = window.innerHeight * 0.3;
      Array.prototype.forEach.call(els, function (el) {
        var cs = window.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        var r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 8) return;
        /* Más alto que un tercio de la pantalla no es una barra superior: es
           un contenedor o un panel lateral desplegado. Si se contara, el
           banner se iría al centro de la pantalla. */
        if (r.height > limite) return;
        /* Una barra lateral (a la izquierda) no queda debajo de la píldora y
           no hay por qué esquivarla. */
        if (r.right <= izq || r.left >= der) return;
        if (r.bottom > extra) extra = r.bottom;
      });
    }
    /* --aiapps-chrome-top sigue como escape manual para una app que necesite
       corregir a mano lo que la medición no vea. */
    var manual = parseFloat(
      window.getComputedStyle(document.documentElement)
        .getPropertyValue("--aiapps-chrome-top")
    );
    if (manual > 0) extra += manual;
    /* Acotado: un valor disparatado dejaría el banner fuera de la pantalla,
       y es position:fixed — no hay scroll que lo recupere. */
    if (extra > window.innerHeight * 0.3) extra = window.innerHeight * 0.3;
    if (!(extra > 0)) extra = 0;
    return Math.round(extra) + GAP;
  }

  var syncPendiente = false;

  function syncTop() {
    if (!host) return;
    host.style.paddingTop = topOffset() + "px";
  }

  function syncTopDiferido() {
    if (syncPendiente || !host) return;
    syncPendiente = true;
    window.requestAnimationFrame(function () {
      syncPendiente = false;
      syncTop();
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
       dejar inservible un botón que quede debajo. Ojo: eso NO basta por sí
       solo — lo que quede justo debajo de la píldora sí queda tapado y sus
       clics los recibe el banner. Por eso además se calcula el hueco con
       topOffset(). */
    host.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:2147483645;" +
      "display:flex;justify-content:center;pointer-events:none;" +
      "padding:0 10px;";

    var shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML =
      '<style>' +
      ':host{ font-family:system-ui,-apple-system,"Segoe UI",sans-serif; }' +
      '.bar{' +
      /* La píldora NO captura clics: solo sus dos botones. Así, aunque quede
         encima de algo de la app (inevitable en pantallas angostas, donde
         debajo de la barra superior ya empieza el contenido), un clic sobre
         esa zona llega a la app y no al banner. El fallo que midió la revisión
         de accesibilidad — clic en la pestaña "Mentoría" que acababa
         recargando la página — deja de ser posible por construcción. */
      '  pointer-events:none;' +
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
      'button{ font:inherit; cursor:pointer; border-radius:999px; flex:0 0 auto; pointer-events:auto; }' +
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
    syncTop();
    window.addEventListener("scroll", syncTopDiferido, { passive: true });
    window.addEventListener("resize", syncTopDiferido, { passive: true });
  }

  function hideBanner() {
    if (!host) return;
    window.removeEventListener("scroll", syncTopDiferido);
    window.removeEventListener("resize", syncTopDiferido);
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
