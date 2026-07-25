/* ===== AI APPs · Candado de acceso (login) =====
   Muestra una pantalla de inicio de sesión (solo login, sin registro,
   pensado para una única cuenta personal) hasta que haya una sesión
   válida de Supabase. Al iniciar sesión, recarga la página. */
(function () {
  function whenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  const ICONS = {
    book: '<path d="M4 5c0-.6.4-1 1-1h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-1.5H4z"/><path d="M20 5c0-.6-.4-1-1-1h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-1.5H20z"/>',
    "graduation-cap": '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11.5v4.5c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/><path d="M22 9v6"/>',
    "chat-bubble": '<path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z"/>',
    lightbulb: '<circle cx="12" cy="9" r="6"/><path d="M9.5 21h5"/><path d="M10 18h4"/><path d="M12 3V1.5"/>',
    pencil: '<path d="M4 20l1-4.2L15.8 5 19 8.2 8.2 19 4 20z"/><path d="M13.5 6.5l4 4"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2.2 5.8L9 17l2.2-5.8z"/>',
    "trending-up": '<path d="M3 19h18"/><path d="M5 15l4.5-5 3.5 3 6-6.5"/><path d="M14.5 6h4.5v4.5"/>',
    people: '<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M2.5 20c0-3.9 2.7-6.5 6-6.5s6 2.6 6 6.5"/><path d="M14.5 20c0-2.8 1.6-5 3.7-5.6"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v9"/><path d="M15 9.8c0-1.3-1.3-2.1-3-2.1s-3 .9-3 2.1c0 3 6 1.3 6 4.1 0 1.3-1.3 2.1-3 2.1s-3-.8-3-2.1"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M15 12a1.6 1.6 0 0 0 0 3.2H20V12z"/>',
    "piggy-bank": '<path d="M4 12a6.5 6.5 0 0 1 12.8-1.6L19 9v3.5l-2 .6c-.3 1-.9 1.8-1.7 2.4V18H13v-1.2a6.9 6.9 0 0 1-2 0V18H8.5v-1.6A6.5 6.5 0 0 1 4 12z"/><path d="M8 11.2h.01"/><path d="M4.5 12.3L2 13"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 7h8"/><path d="M8 12h0"/><path d="M12 12h0"/><path d="M16 12v6"/><path d="M8 16h0"/><path d="M12 16h0"/><path d="M8 12v0"/>',
    "dollar-sign": '<path d="M12 2v20"/><path d="M16.5 6.5c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3.2c0 4.3 9 2 9 6.3 0 2-2 3.2-4.5 3.2s-4.5-1.1-4.5-3"/>',
    "credit-card": '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3 9.5h18"/><path d="M6.5 14.5h4"/>',
    safe: '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5V6"/><path d="M12 18v-2.5"/>',
    "bar-chart": '<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/><path d="M2 20h20"/>',
    clipboard: '<rect x="5.5" y="4" width="13" height="17" rx="1.5"/><rect x="9" y="2" width="6" height="3.5" rx="1"/><path d="M8.5 11l2 2 4-4.5"/>',
    magnifier: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
    briefcase: '<rect x="2.5" y="7" width="19" height="12" rx="1.5"/><path d="M8 7V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7"/><path d="M2.5 12.5h19"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2.5 12h3M18.5 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    airplane: '<path d="M12 2l1.5 6.5L21 12l-7.5 2L12 22l-1.5-8L3 12l7.5-3.5z"/>',
    "map-pin": '<path d="M12 21s7-6.8 7-12a7 7 0 0 0-14 0c0 5.2 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
    suitcase: '<rect x="3" y="7.5" width="18" height="11.5" rx="1.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3 13h18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 2.6 2.8 15.4 0 18M12 3c-2.8 2.6-2.8 15.4 0 18"/>',
    mountain: '<path d="M2 19l6-10 4 5.5 2.5-3.5L22 19z"/>',
    calendar: '<rect x="4" y="5" width="16" height="15.5" rx="1.5"/><path d="M4 9.5h16"/><path d="M8 3v3.5M16 3v3.5"/><path d="M8 13h0M12 13h0M16 13h0M8 17h0M12 17h0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4.5h13l-3 4 3 4H5"/>'
  };

  /* El candado es una superposición: el resto de la página sigue existiendo
     detrás y, sin esto, seguía siendo alcanzable con Tab (y por lo tanto
     accionable con teclado) aunque no hubiera sesión. `inert` la saca del
     orden de tabulación, del árbol de accesibilidad y de los clics de una
     sola vez. Se recuerda qué elementos se marcaron para poder devolverlos
     como estaban al quitar la superposición. */
  let inertedEls = [];
  let inertObserver = null;

  function applyInert(host) {
    Array.prototype.forEach.call(document.body.children, (el) => {
      if (el === host || el.hasAttribute("inert")) return;
      el.setAttribute("inert", "");
      inertedEls.push(el);
    });
  }

  function lockBackground(host) {
    unlockBackground();
    applyInert(host);
    /* Varias apps agregan elementos al body después de que se pinta el
       candado (el badge de carpeta local, por ejemplo, que abre el selector
       de carpetas con permiso de escritura). Sin esto se quedaban fuera
       del bloqueo. */
    if (typeof MutationObserver === "function") {
      inertObserver = new MutationObserver(() => applyInert(host));
      inertObserver.observe(document.body, { childList: true });
    }
  }

  function unlockBackground() {
    if (inertObserver) {
      inertObserver.disconnect();
      inertObserver = null;
    }
    inertedEls.forEach((el) => el.removeAttribute("inert"));
    inertedEls = [];
  }

  function removeExistingOverlay() {
    const existing = document.getElementById("aiapps-auth-gate");
    if (existing) {
      if (existing._aiappsTimers) existing._aiappsTimers.forEach((id) => clearInterval(id));
      if (existing._aiappsCleanups) existing._aiappsCleanups.forEach((fn) => fn());
      existing.remove();
    }
    unlockBackground();
  }

  // Reparte `count` posiciones por toda la pantalla (no solo en las esquinas),
  // saltando la zona donde va la tarjeta de login para no tapar el formulario.
  function scatterCells(count) {
    const cols = [4, 12, 21, 30, 40, 50, 60, 70, 79, 88, 94];
    const rows = [4, 11, 22, 34, 46, 58, 70, 82, 89, 95];
    const alignRight = window.AIAPPS_LOGIN_LAYOUT === 'right';
    // La tarjeta mide `min(320px, 90vw)` de ancho y unos 460px de alto, así que
    // en porcentaje ocupa muchísimo más en un teléfono que en un monitor: la
    // zona a esquivar hay que calcularla, no dejarla fija, o en pantalla
    // angosta los iconos caen encima del formulario.
    const vw = window.innerWidth || 1280;
    const vh = window.innerHeight || 720;
    // El icono más grande mide 2.7rem; se cuenta su tamaño (más un margen) para
    // que la esquina de un icono tampoco toque la tarjeta.
    const iconW = 46 / vw * 100;
    const iconH = 46 / vh * 100;
    // `.card` no tiene `box-sizing:border-box`, así que a su `width` hay que
    // sumarle los 28px de padding de cada lado: en un teléfono de 375px el
    // ancho real es 376px — toda la pantalla, no el 85% que da la regla CSS
    // sola. Calcularlo de menos fue lo que dejó iconos sobre el formulario.
    const cardW = Math.min(Math.min(320, vw * 0.9) + 56, vw) / vw * 100;
    const cardH = Math.min(460 / vh * 100, 88);
    const cardRight = alignRight ? 92 : 50 + cardW / 2;
    const cardLeft = (alignRight ? 92 - cardW : 50 - cardW / 2);
    const cardTop = 50 - cardH / 2;
    const cardBottom = 50 + cardH / 2;
    const maxLeft = 99 - iconW;
    const maxTop = 99 - iconH;
    const touchesCard = (left, top) => (
      left + iconW > cardLeft && left < cardRight &&
      top + iconH > cardTop && top < cardBottom
    );
    const sides = [];
    const overUnder = [];
    rows.forEach((top) => cols.forEach((left) => {
      if (touchesCard(left, top)) return;
      const sameColumnAsCard = left + iconW > cardLeft && left < cardRight;
      if (sameColumnAsCard) overUnder.push({ top, left });
      else sides.push({ top, left });
    }));
    if (!sides.length && !overUnder.length) return [];

    // Se recorre la rejilla en orden y se toma una celda al azar dentro de cada
    // tramo: así quedan repartidos por toda la pantalla en vez de amontonarse.
    const sample = (pool, howMany) => {
      if (!pool.length || howMany <= 0) return [];
      const step = pool.length / howMany;
      return Array.from({ length: howMany }, (_, i) => {
        const start = Math.floor(i * step);
        const end = Math.max(start + 1, Math.floor((i + 1) * step));
        return pool[Math.min(pool.length - 1, start + Math.floor(Math.random() * (end - start)))];
      });
    };
    // Una quinta parte va arriba y abajo de la tarjeta, para que esa franja del
    // centro no quede vacía. En pantalla angosta la tarjeta se come casi todo el
    // ancho y quedan pocas celdas a los costados, así que ahí la proporción se
    // invierte sola en vez de amontonar 29 iconos en una sola columna.
    const fromCenter = Math.min(overUnder.length, Math.max(Math.round(count * 0.2), count - sides.length));
    const fromSides = Math.min(sides.length, count - fromCenter);
    const picked = sample(overUnder, fromCenter).concat(sample(sides, fromSides));
    for (let i = picked.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }
    // Se le suma un desvío al azar a cada celda para que no se note la rejilla,
    // sin dejar que ningún icono se salga del borde. Si el desvío empujó la
    // posición sobre la tarjeta, se vuelve a la celda original; y si la celda
    // tampoco entra (pantalla muy chica), ese icono no se dibuja: es preferible
    // que haya menos iconos que uno encima del formulario.
    return picked.map((cell) => {
      const top = Math.min(maxTop, Math.max(1, cell.top + (Math.random() - 0.5) * 6));
      const left = Math.min(maxLeft, Math.max(1, cell.left + (Math.random() - 0.5) * 6));
      if (!touchesCard(left, top)) return { top, left };
      const rawTop = Math.min(maxTop, Math.max(1, cell.top));
      const rawLeft = Math.min(maxLeft, Math.max(1, cell.left));
      return touchesCard(rawLeft, rawTop) ? null : { top: rawTop, left: rawLeft };
    }).filter(Boolean);
  }

  function buildOverlay() {
    removeExistingOverlay();
    const host = document.createElement("div");
    host.id = "aiapps-auth-gate";
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647;";
    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        .cover{
          position:fixed; inset:0;
          background:
            radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), ${window.AIAPPS_APP_GLOW || 'rgba(184,134,59,0.16)'}, transparent 45%),
            ${window.AIAPPS_APP_BG || '#131B23'};
          display:flex; align-items:center; justify-content:center;
          font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
        }
        .card{
          position:relative;
          z-index:4;
          width:min(320px, 90vw);
          background:#EFEADC;
          border-radius:6px;
          padding:32px 28px;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
          transform:perspective(800px) rotateX(0deg) rotateY(0deg);
          transition:transform 0.15s ease-out;
          will-change:transform;
        }
        h1{
          font-size:1.1rem;
          margin:0 0 18px;
          color:#1B2430;
          text-align:center;
        }
        .brand-logo-img{
          display:block;
          width:56px;
          height:56px;
          border-radius:12px;
          object-fit:cover;
          margin:0 auto 10px;
        }
        .brand{
          text-align:center;
          margin-bottom:18px;
        }
        .brand-mark{
          font-family:Georgia,'Times New Roman',serif;
          font-size:${window.AIAPPS_APP_LOGO_SIZE || '1.5rem'};
          font-weight:600;
          letter-spacing:-0.02em;
          color:#1B2430;
        }
        .brand-tagline{
          font-size:0.68rem;
          letter-spacing:0.08em;
          text-transform:uppercase;
          color:#8B94A3;
          margin-top:4px;
        }
        .logo-bars{
          display:inline-block;
          vertical-align:-0.28em;
          margin-right:0.1em;
        }
        .logo-bars svg{ display:block; width:1.7em; height:1.7em; }
        .logo-bars rect{ transform-box:fill-box; transform-origin:center bottom; }
        .logo-bars .lb-1{ fill:#B79BE0; animation:logo-bar-1 2.2s ease-in-out infinite; }
        .logo-bars .lb-2{ fill:#F0C550; animation:logo-bar-2 2.2s ease-in-out infinite; }
        .logo-bars .lb-3{ fill:#B79BE0; animation:logo-bar-3 2.2s ease-in-out infinite; }
        @keyframes logo-bar-1{
          0%, 100%{ transform:scaleY(0.42); }
          50%{ transform:scaleY(1); }
        }
        @keyframes logo-bar-2{
          0%, 100%{ transform:scaleY(1); }
          45%{ transform:scaleY(0.38); }
        }
        @keyframes logo-bar-3{
          0%, 100%{ transform:scaleY(0.7); }
          30%{ transform:scaleY(1); }
          70%{ transform:scaleY(0.35); }
        }
        @media (prefers-reduced-motion: reduce){
          .logo-bars .lb-1{ animation:none; transform:scaleY(0.55); }
          .logo-bars .lb-2{ animation:none; transform:scaleY(1); }
          .logo-bars .lb-3{ animation:none; transform:scaleY(0.75); }
        }
        .emoji-wrap{ position:relative; display:inline-block; }
        .coin{
          position:absolute;
          left:50%;
          bottom:0.15em;
          font-size:0.55em;
          opacity:0;
          animation:coin-pop 1.6s ease-in infinite;
          pointer-events:none;
        }
        .coin:nth-child(1){ --cx:1.76em; animation-delay:0s; }
        .coin:nth-child(2){ --cx:-1.47em; animation-delay:0.5s; }
        .coin:nth-child(3){ --cx:0.44em; animation-delay:1s; }
        @keyframes coin-pop{
          0%{ opacity:0; transform:translate(-50%,0) scale(0.4) rotate(0deg); }
          18%{ opacity:1; transform:translate(-50%,-1.18em) scale(0.9) rotate(70deg); }
          100%{ opacity:0; transform:translate(calc(-50% + var(--cx,1.5em)),2.06em) scale(0.6) rotate(320deg); }
        }
        .coin-rain{
          position:absolute;
          z-index:1;
          top:-10%;
          width:26px;
          height:26px;
          opacity:0;
          animation:coin-fall var(--dur,7s) linear infinite;
          animation-delay:var(--delay,0s);
          animation-fill-mode:backwards;
          pointer-events:none;
          filter:drop-shadow(0 3px 5px rgba(0,0,0,0.45));
          perspective:190px;
        }
        .coin-rain svg{ width:100%; height:100%; display:block; overflow:visible; }
        /* La caída y el giro van separados: aquí solo el descenso y el
           bamboleo. El giro es 3D de verdad (ver .coin-3d) — antes era un
           scaleX que achataba la moneda entera, así que al ponerse de canto
           no quedaba grosor y se veía como una hoja de papel. */
        @keyframes coin-fall{
          0%{ transform:translateY(0) rotate(-6deg); opacity:0; }
          6%{ opacity:1; }
          25%{ transform:translateY(30vh) rotate(4deg); }
          50%{ transform:translateY(60vh) rotate(-5deg); }
          75%{ transform:translateY(90vh) rotate(6deg); }
          94%{ opacity:1; }
          100%{ transform:translateY(118vh) rotate(-4deg); opacity:0; }
        }
        /* Cilindro: dos caras separadas por el grosor, con el canto metálico
           entremedio. El canto es una placa girada 90°, así que queda
           invisible de frente y se muestra completa justo cuando las caras
           se ponen de perfil — que es el momento en que antes desaparecía. */
        .coin-3d{
          position:absolute;
          inset:0;
          transform-style:preserve-3d;
          animation:coin-spin var(--spin,3.4s) linear infinite;
        }
        .coin-face{
          position:absolute;
          inset:0;
          backface-visibility:hidden;
        }
        .coin-face-back{ transform:rotateY(180deg) translateZ(var(--half,3px)); }
        .coin-face-front{ transform:translateZ(var(--half,3px)); }
        .coin-side{
          position:absolute;
          top:1px; bottom:1px;
          left:50%;
          width:var(--thick,6px);
          margin-left:calc(var(--thick,6px) / -2);
          transform:rotateY(90deg);
          border-radius:2px;
          /* Mismos tonos que el canto de las monedas del suelo
             (#coinEdgeGrad), para que se lean del mismo material. */
          background:linear-gradient(90deg,#4a2f07 0%,#9c6a12 22%,#e0b24a 50%,#a9761a 78%,#5c3a09 100%);
          box-shadow:inset 0 -3px 4px rgba(0,0,0,0.45);
        }
        @keyframes coin-spin{
          from{ transform:rotateX(14deg) rotateY(0deg); }
          to{ transform:rotateX(14deg) rotateY(360deg); }
        }
        .sparkle-glint{
          position:absolute;
          width:20px; height:20px;
          opacity:0;
          animation:sparkle-flash 1.7s ease-in-out infinite;
          pointer-events:none;
          filter:drop-shadow(0 0 4px rgba(255,249,230,0.9));
        }
        .sparkle-glint svg{ width:100%; height:100%; fill:#fff9e6; }
        @keyframes sparkle-flash{
          0%, 65%, 100%{ opacity:0; transform:scale(0.2) rotate(0deg); }
          75%{ opacity:1; transform:scale(1.15) rotate(20deg); }
          85%{ opacity:0.8; transform:scale(0.8) rotate(20deg); }
          93%{ opacity:0; transform:scale(0.3) rotate(20deg); }
        }
        .coin-floor{
          position:absolute; left:0; right:0; bottom:0;
          z-index:0;
          pointer-events:none;
        }
        .coin-floor-bg{
          position:absolute; left:0; right:0; bottom:0; height:40%;
          background:linear-gradient(180deg, rgba(184,134,59,0) 0%, rgba(184,134,59,0.35) 100%);
        }
        .coin-floor svg{ position:absolute; left:0; right:0; bottom:0; width:100%; height:100%; display:block; }
        .floor-sparkle{
          transform-box:fill-box; transform-origin:center;
          fill:#fff9e6;
          opacity:0;
          animation:sparkle-flash 2.4s ease-in-out infinite;
          filter:drop-shadow(0 0 3px rgba(255,249,230,0.9));
        }
        .cover.align-right{ justify-content:flex-end; padding-right:8vw; }
        .gantt-scene{
          position:absolute; left:6%; top:20%; width:min(38%, 420px); height:60%;
          display:flex; flex-direction:column; justify-content:space-between;
          pointer-events:none;
        }
        .gantt-row{ position:relative; height:12px; background:rgba(255,255,255,0.1); border-radius:4px; }
        .gantt-bar{
          position:absolute; left:0; top:0; height:100%; border-radius:4px;
          width:0%;
          animation:gantt-grow 6s ease-in-out infinite;
        }
        .gantt-bar.c-lila{ background:linear-gradient(90deg, #7E5EC2, #C3ABF0); }
        .gantt-bar.c-amarillo{ background:linear-gradient(90deg, #C99A2E, #F5D77A); }
        .gantt-bar.c-purpura{ background:linear-gradient(90deg, #4C2A80, #9B6BD6); }
        .gantt-dot{
          position:absolute; top:50%; width:9px; height:9px; border-radius:50%;
          margin:-4.5px 0 0 -4.5px;
          box-shadow:0 0 6px 1px rgba(255,255,255,0.5);
          opacity:0;
          animation:gantt-dot-move 6s ease-in-out infinite;
        }
        .gantt-dot.c-lila{ background:#DCCCF7; }
        .gantt-dot.c-amarillo{ background:#F3D9A8; }
        .gantt-dot.c-purpura{ background:#C7A6F0; }
        .gantt-flag{
          position:absolute; bottom:2px; width:26px; height:26px;
          margin-left:-3px;
          opacity:0;
          transform-origin:12% 100%;
          animation:gantt-flag-show 6s ease-in-out infinite;
        }
        .gantt-flag svg{ width:100%; height:100%; fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
        .gantt-date{
          position:absolute; top:-22px; font-size:0.6rem; color:rgba(255,255,255,0.6);
          transform:translateY(-10px); opacity:0;
          animation:gantt-date-fall 6s ease-in-out infinite;
        }
        @keyframes gantt-grow{
          0%, 8%{ width:0%; }
          55%, 85%{ width:var(--w,70%); }
          100%{ width:0%; }
        }
        @keyframes gantt-dot-move{
          0%, 8%{ opacity:0; left:0%; }
          10%{ opacity:1; }
          55%, 85%{ opacity:1; left:var(--w,70%); }
          92%, 100%{ opacity:0; left:var(--w,70%); }
        }
        @keyframes gantt-flag-show{
          0%, 56%{ opacity:0; transform:scale(0.4) rotate(0deg); }
          64%{ opacity:1; transform:scale(1.15) rotate(-6deg); }
          72%, 85%{ opacity:1; transform:scale(1) rotate(-4deg); }
          92%, 100%{ opacity:0; transform:scale(0.4) rotate(0deg); }
        }
        @keyframes gantt-date-fall{
          0%, 8%{ opacity:0; transform:translateY(-10px); }
          16%, 50%{ opacity:0.85; transform:translateY(0px); }
          58%, 100%{ opacity:0; }
        }
        .travel-skyline{
          position:absolute; left:0; right:0; bottom:0; height:46%;
          filter:blur(1.2px); opacity:0.66; pointer-events:none;
        }
        .travel-skyline svg{ width:100%; height:100%; display:block; }
        .travel-cloud-drift{
          animation:cloud-drift-back linear infinite;
        }
        @keyframes cloud-drift-back{
          0%{ transform:translateX(-6%); }
          100%{ transform:translateX(6%); }
        }
        .cloud-el{
          position:absolute;
          opacity:0.55;
          z-index:1;
          pointer-events:none;
          animation:cloud-drift-screen linear infinite alternate;
        }
        .cloud-el svg{ width:100%; height:100%; }
        @keyframes cloud-drift-screen{
          0%{ transform:translateX(-6%); }
          100%{ transform:translateX(6%); }
        }
        .plane{
          position:absolute; width:26px; height:26px;
          opacity:0;
          filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35));
        }
        .plane svg{ width:100%; height:100%; fill:none; stroke:#f1f6f5; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
        .plane-behind{ z-index:1; }
        .plane-front{ z-index:3; }
        @keyframes fly-1{
          0%{ left:-10%; top:90%; transform:rotate(55deg); opacity:0; }
          8%{ opacity:0.95; }
          90%{ opacity:0.95; }
          100%{ left:110%; top:5%; transform:rotate(55deg); opacity:0; }
        }
        @keyframes fly-2{
          0%{ left:105%; top:15%; transform:rotate(243deg); opacity:0; }
          8%{ opacity:0.9; }
          90%{ opacity:0.9; }
          100%{ left:-15%; top:75%; transform:rotate(243deg); opacity:0; }
        }
        @keyframes fly-3{
          0%{ left:-10%; top:55%; transform:rotate(78deg); opacity:0; }
          8%{ opacity:0.85; }
          90%{ opacity:0.85; }
          100%{ left:110%; top:30%; transform:rotate(78deg); opacity:0; }
        }
        @keyframes fly-4{
          0%{ left:15%; top:100%; transform:rotate(31deg); opacity:0; }
          10%{ opacity:0.9; }
          88%{ opacity:0.9; }
          100%{ left:85%; top:-15%; transform:rotate(31deg); opacity:0; }
        }
        @keyframes fly-5{
          0%{ left:105%; top:45%; transform:rotate(286deg); opacity:0; }
          8%{ opacity:0.9; }
          90%{ opacity:0.9; }
          100%{ left:-15%; top:10%; transform:rotate(286deg); opacity:0; }
        }
        @keyframes fly-6{
          0%{ left:90%; top:95%; transform:rotate(323deg); opacity:0; }
          10%{ opacity:0.85; }
          88%{ opacity:0.85; }
          100%{ left:10%; top:-10%; transform:rotate(323deg); opacity:0; }
        }
        /* Avion del logo de MyTravel: flota en su sitio, con dos nubecitas. */
        .logo-plane{
          position:relative;
          display:inline-block;
          margin-right:0.18em;
          padding:0 0.12em;
        }
        .logo-plane .lp-glyph{
          display:inline-block;
          animation:logo-plane-float 3.6s ease-in-out infinite;
        }
        .logo-plane .lp-cloud{
          position:absolute;
          height:auto;
          fill:#A9BFC4;
          opacity:0.6;
          pointer-events:none;
        }
        .logo-plane .lp-cloud-1{
          width:0.62em; top:-0.06em; left:-0.42em;
          animation:logo-cloud-float 5s ease-in-out infinite;
        }
        .logo-plane .lp-cloud-2{
          width:0.44em; bottom:0.02em; right:-0.3em; opacity:0.45;
          animation:logo-cloud-float 6.4s ease-in-out infinite reverse;
        }
        @keyframes logo-plane-float{
          0%, 100%{ transform:translateY(0); }
          50%{ transform:translateY(-0.16em); }
        }
        @keyframes logo-cloud-float{
          0%, 100%{ transform:translateY(0); }
          50%{ transform:translateY(-0.08em); }
        }
        @media (prefers-reduced-motion: reduce){
          /* Sin movimiento: aviones y nubes se quedan quietos en su posicion. */
          .plane{ animation:none !important; opacity:0.85; }
          .cloud-el, .travel-cloud-drift{ animation:none !important; }
          .logo-plane .lp-glyph, .logo-plane .lp-cloud{ animation:none; }
        }
        .growth-scene{
          position:absolute; left:2.5%; bottom:3%; height:76%;
          width:min(56%, 720px, calc(78vw - 355px));
          pointer-events:none;
        }
        /* Más abajo ya no queda ancho útil: la cordillera saldría aplastada. */
        @media (max-width: 900px){
          .growth-scene{ display:none; }
        }
        .growth-range{
          position:absolute; inset:0; width:100%; height:100%; overflow:visible;
        }
        .growth-mark{
          position:absolute; width:56px; height:56px;
          margin:-28px 0 0 -28px;
          opacity:0;
          animation-duration:30s;
          animation-timing-function:ease-in-out;
          animation-iteration-count:infinite;
        }
        .growth-mark svg{ width:100%; height:100%; fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
        .growth-mark.check svg{ stroke:#9ae8d1; }
        .growth-mark.cross svg{ stroke:#e8705c; }
        .growth-mark.c1{ animation-name:mk-c1; }
        .growth-mark.c2{ animation-name:mk-c2; }
        .growth-mark.c3{ animation-name:mk-c3; }
        .growth-mark.c4{ animation-name:mk-c4; }
        .growth-mark.c5{ animation-name:mk-c5; }
        .growth-mark.c6{ animation-name:mk-c6; }
        .growth-mark.x3{ animation-name:mk-x3; }
        .growth-mark.x5{ animation-name:mk-x5; }
        @keyframes mk-c1{
          0%, 16%{ opacity:0; scale:0.5; }
          19%{ opacity:0.55; scale:1.2; }
          22%, 98%{ opacity:0.38; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-c2{
          0%, 25%{ opacity:0; scale:0.5; }
          28%{ opacity:0.55; scale:1.2; }
          31%, 34%{ opacity:0.38; scale:1; }
          35%, 43%{ opacity:0; scale:0.5; }
          46%{ opacity:0.55; scale:1.2; }
          49%, 98%{ opacity:0.38; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-c3{
          0%, 52%{ opacity:0; scale:0.5; }
          55%{ opacity:0.55; scale:1.2; }
          58%, 98%{ opacity:0.38; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-c4{
          0%, 61%{ opacity:0; scale:0.5; }
          64%{ opacity:0.55; scale:1.2; }
          67%, 70%{ opacity:0.38; scale:1; }
          71%, 79%{ opacity:0; scale:0.5; }
          82%{ opacity:0.55; scale:1.2; }
          85%, 98%{ opacity:0.38; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-c5{
          0%, 86.5%{ opacity:0; scale:0.5; }
          89%{ opacity:0.55; scale:1.2; }
          90.5%, 98%{ opacity:0.38; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-c6{
          0%, 89%{ opacity:0; scale:0.5; }
          91.5%{ opacity:0.6; scale:1.25; }
          93%, 98%{ opacity:0.4; scale:1; }
          100%{ opacity:0; scale:1; }
        }
        @keyframes mk-x3{
          0%, 27%{ opacity:0; scale:0.5; }
          30%{ opacity:0.62; scale:1.25; }
          33%, 43%{ opacity:0.44; scale:1; }
          44%, 100%{ opacity:0; scale:1; }
        }
        @keyframes mk-x5{
          0%, 63%{ opacity:0; scale:0.5; }
          66%{ opacity:0.62; scale:1.25; }
          69%, 79%{ opacity:0.44; scale:1; }
          80%, 100%{ opacity:0; scale:1; }
        }
        /* La bandera cuelga dentro del muñequito, agarrada por la manito:
           al ser hija de .hop-figure viaja con él y se mantiene en su sitio. */
        .growth-flag{
          position:absolute; left:20px; top:2px; width:30px; height:30px;
          opacity:0;
          transform-origin:21% 46%;
          animation:flag-cycle 30s ease-in-out infinite, flag-flutter 0.9s ease-in-out infinite;
        }
        .growth-flag svg{ width:100%; height:100%; fill:none; stroke:#D8AE6E; stroke-width:1.4; stroke-linecap:round; stroke-linejoin:round; }
        /* Arranca en 88.5% y no en 87%: si asoma durante el rebote del
           aterrizaje hereda el squash del muñeco y se ve deformada. */
        @keyframes flag-cycle{
          0%, 88.5%{ opacity:0; scale:0.5; translate:0 8px; }
          90.5%{ opacity:0.95; scale:1.15; translate:0 -2px; }
          92%, 98%{ opacity:0.95; scale:1; translate:0 0; }
          100%{ opacity:0; scale:1; translate:0 0; }
        }
        @keyframes flag-flutter{
          0%, 100%{ rotate:-10deg; }
          50%{ rotate:-17deg; }
        }
        /* El bracito y la manito solo salen en la cima, al agarrar la bandera. */
        .hop-arm, .hop-hand{
          opacity:0;
          animation:arm-show 30s ease-in-out infinite;
        }
        @keyframes arm-show{
          0%, 86.5%{ opacity:0; }
          88.5%, 98%{ opacity:1; }
          100%{ opacity:0; }
        }
        .firework{
          position:absolute; width:54px; height:54px;
          margin:-27px 0 0 -27px;
          opacity:0;
          animation-duration:30s;
          animation-timing-function:ease-out;
          animation-iteration-count:infinite;
        }
        .firework svg{ width:100%; height:100%; }
        .firework.fw1{ animation-name:fw-a; }
        .firework.fw2{ animation-name:fw-b; }
        .firework.fw3{ animation-name:fw-c; }
        @keyframes fw-a{
          0%, 87.3%{ opacity:0; scale:0.15; }
          88.8%{ opacity:1; scale:0.75; }
          90.3%{ opacity:0.85; scale:1.05; }
          92.3%{ opacity:0; scale:1.3; }
          95.5%{ opacity:0; scale:0.15; }
          96.8%{ opacity:1; scale:0.75; }
          98.4%{ opacity:0.8; scale:1.05; }
          99.8%, 100%{ opacity:0; scale:1.3; }
        }
        @keyframes fw-b{
          0%, 90.5%{ opacity:0; scale:0.15; }
          92%{ opacity:1; scale:0.8; }
          93.5%{ opacity:0.85; scale:1.1; }
          95.5%, 100%{ opacity:0; scale:1.35; }
        }
        @keyframes fw-c{
          0%, 93%{ opacity:0; scale:0.15; }
          94.5%{ opacity:1; scale:0.7; }
          96%{ opacity:0.85; scale:1.05; }
          98%, 100%{ opacity:0; scale:1.3; }
        }
        .hop-figure{
          position:absolute; width:30px; height:40px;
          margin:-40px 0 0 -15px;
          transform-origin:50% 100%;
          animation:hop-move 30s ease-in-out infinite, hop-squash 30s ease-in-out infinite, hop-mood 30s linear infinite;
        }
        .hop-figure svg{ width:100%; height:100%; }
        @keyframes hop-move{
          0%, 2%{ opacity:0; left:1%; top:100%; }
          3%{ opacity:1; left:2%; top:98%; }
          5.5%{ left:6%; top:66%; }
          8%, 14%{ left:11%; top:76%; }
          15.5%{ left:19%; top:55%; }
          17%, 23%{ left:27%; top:63%; }
          24.5%{ left:35%; top:42%; }
          26%, 32%{ left:43%; top:50%; }
          33.5%{ left:35%; top:42%; }
          35%, 41%{ left:27%; top:63%; }
          42.5%{ left:35%; top:42%; }
          44%, 50%{ left:43%; top:50%; }
          51.5%{ left:51%; top:29%; }
          53%, 59%{ left:59%; top:37%; }
          60.5%{ left:67%; top:15%; }
          62%, 68%{ left:75%; top:23%; }
          69.5%{ left:67%; top:15%; }
          71%, 77%{ left:59%; top:37%; }
          78.5%{ left:67%; top:15%; }
          80%, 85%{ left:75%; top:23%; }
          86%{ left:83%; top:0%; }
          87%, 98%{ opacity:1; left:91%; top:7%; }
          100%{ opacity:0; left:91%; top:7%; }
        }
        @keyframes hop-squash{
          0%, 2%{ scale:0.5; }
          3%{ scale:0.9 1.12; }
          5.5%{ scale:1.06 0.94; }
          8%{ scale:0.86 1.14; }
          10%, 14%{ scale:1; }
          15.5%{ scale:1.06 0.94; }
          17%{ scale:0.86 1.14; }
          19%, 23%{ scale:1; }
          24.5%{ scale:1.06 0.94; }
          26%{ scale:0.86 1.14; }
          28%, 32%{ scale:1; }
          33.5%{ scale:1.06 0.94; }
          35%{ scale:0.86 1.14; }
          37%, 41%{ scale:1; }
          42.5%{ scale:1.06 0.94; }
          44%{ scale:0.86 1.14; }
          46%, 50%{ scale:1; }
          51.5%{ scale:1.06 0.94; }
          53%{ scale:0.86 1.14; }
          55%, 59%{ scale:1; }
          60.5%{ scale:1.06 0.94; }
          62%{ scale:0.86 1.14; }
          64%, 68%{ scale:1; }
          69.5%{ scale:1.06 0.94; }
          71%{ scale:0.86 1.14; }
          73%, 77%{ scale:1; }
          78.5%{ scale:1.06 0.94; }
          80%{ scale:0.86 1.14; }
          82%, 85%{ scale:1; }
          86%{ scale:1.06 0.94; }
          87%{ scale:0.86 1.14; }
          88.5%, 98%{ scale:1; }
          100%{ scale:0.5; }
        }
        /* Se pone gris DESPUÉS de que la ✗ ya se ve (30% y 66%): la marca es
           la causa y el color del muñeco la consecuencia, no al revés. */
        @keyframes hop-mood{
          0%, 30%{ filter:grayscale(0) brightness(1); }
          30.5%, 40.5%{ filter:grayscale(1) brightness(0.62); }
          41%, 66%{ filter:grayscale(0) brightness(1); }
          66.5%, 76.5%{ filter:grayscale(1) brightness(0.62); }
          77%, 100%{ filter:grayscale(0) brightness(1); }
        }
        @media (prefers-reduced-motion: reduce){
          .growth-mark, .hop-figure, .growth-flag,
          .hop-arm, .hop-hand, .firework{ animation:none !important; }
          .growth-mark.check{ opacity:0.38; }
          .growth-mark.cross{ opacity:0; }
          .hop-figure{ left:91%; top:7%; opacity:1; }
          .growth-flag{ opacity:0.95; }
          .hop-arm, .hop-hand{ opacity:1; }
          .firework{ opacity:0.5; scale:1; }
        }
        .interview-icon{
          position:absolute;
          width:2.1rem;
          height:2.1rem;
          opacity:0.55;
          transition:transform 0.35s ease, opacity 0.35s ease;
          pointer-events:auto;
        }
        .interview-icon svg{
          width:100%;
          height:100%;
          fill:none;
          stroke-width:1.3;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .interview-icon-float{
          width:100%;
          height:100%;
          animation:interview-bounce 2.6s infinite;
        }
        .interview-icon:hover,
        .interview-icon.auto-focus{
          opacity:0.9;
          transform:scale(1.3) rotate(-8deg);
        }
        @keyframes interview-bounce{
          0% { transform:translateY(-36px); animation-timing-function:cubic-bezier(0.45,0,0.9,0.55); }
          52% { transform:translateY(0); animation-timing-function:cubic-bezier(0.1,0.45,0.55,1); }
          72% { transform:translateY(-12px); animation-timing-function:cubic-bezier(0.45,0,0.9,0.55); }
          88% { transform:translateY(0); animation-timing-function:cubic-bezier(0.1,0.45,0.55,1); }
          100% { transform:translateY(0); }
        }
        label{
          display:block;
          font-size:0.75rem;
          color:#3E4757;
          margin:14px 0 4px;
        }
        input{
          width:100%;
          box-sizing:border-box;
          padding:9px 10px;
          border:1px solid #C9C2AC;
          border-radius:4px;
          font-size:0.95rem;
          background:#fff;
          color:#1B2430;
        }
        button{
          width:100%;
          margin-top:20px;
          padding:10px;
          border:none;
          border-radius:4px;
          background:#B8863B;
          color:#fff;
          font-size:0.9rem;
          font-weight:600;
          cursor:pointer;
        }
        button:disabled{ opacity:0.6; cursor:default; }
        .error{
          margin-top:12px;
          font-size:0.8rem;
          color:#B8433B;
          min-height:1em;
          text-align:center;
        }
        .ok{
          margin-top:12px;
          font-size:0.8rem;
          color:#4E8B8B;
          min-height:1em;
          text-align:center;
        }
        .link-row{
          text-align:center;
          margin-top:14px;
        }
        /* Es un <button> (no un <a> sin href) para que se pueda alcanzar con
           Tab y activar con Enter/Espacio; el aspecto de enlace se mantiene. */
        .link-row button{
          width:auto;
          margin-top:0;
          padding:2px 4px;
          border:none;
          background:none;
          font-family:inherit;
          font-weight:400;
          font-size:0.78rem;
          color:#8B94A3;
          cursor:pointer;
          text-decoration:underline;
        }
        .link-row button:focus-visible{
          outline:2px solid #1B2430;
          outline-offset:2px;
          border-radius:3px;
        }
        .pw-field{ display:block; }
        .pw-field.hidden{ display:none; }
        .deco{
          position:absolute;
          width:2.3rem;
          height:2.3rem;
          opacity:0.24;
          transition:transform 0.35s ease, opacity 0.35s ease;
          pointer-events:auto;
        }
        .deco-float{
          width:100%;
          height:100%;
          animation:deco-float 5s ease-in-out infinite;
        }
        .deco svg{
          width:100%;
          height:100%;
          fill:none;
          stroke:rgba(255,255,255,0.75);
          stroke-width:1.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .deco:hover,
        .deco.auto-focus{
          opacity:0.8;
          transform:scale(1.35) rotate(-8deg);
        }
        @media (prefers-reduced-motion: reduce){
          .interview-icon.auto-focus, .deco.auto-focus{ transform:none; }
        }
        @keyframes deco-float{
          0%, 100% { transform:translateY(0) rotate(0deg); }
          50% { transform:translateY(-9px) rotate(5deg); }
        }
      </style>
      <div class="cover ${window.AIAPPS_LOGIN_LAYOUT === 'right' ? 'align-right' : ''}">
        ${window.AIAPPS_LOGIN_SCENE === 'coins-rain' ? (() => {
          const STAR = 'M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z';
          // La escena se dibuja en píxeles (1 unidad del viewBox = 1px) para que
          // las monedas no se deformen al estirar el SVG a lo ancho de la pantalla.
          // Sin piso de ancho: el viewBox tiene que medir exactamente lo que
          // mide el contenedor, o `preserveAspectRatio="none"` vuelve a
          // deformar las monedas en ventanas más angostas que ese piso.
          const W = Math.round(window.innerWidth) || 1280;
          // En pantallas angostas se limita el alto (y el de las cumbres) en
          // función del ancho, para que los picos no queden como agujas.
          const H = Math.max(120, Math.min(Math.round((window.innerHeight || 800) * 0.34), 230, Math.round(W * 0.42)));
          const baseline = H - 4;
          const peakH = Math.min(H * 0.72, W * 0.26);
          const valleyH = H * 0.13;
          // Cordillera en zigzag: nodos alternados cumbre / valle unidos por
          // rectas, así los picos quedan afilados en vez de redondeados.
          // Pocas cumbres y bien separadas.
          const segs = Math.max(4, Math.round(W / 330)) * 2;
          // Alturas mezcladas a partir de una lista fija barajada, para que
          // siempre haya cumbres grandes, medianas y chicas (con azar puro
          // salían todas parecidas).
          const heightMix = [1, 0.38, 0.74, 0.28, 0.9, 0.48, 0.62, 0.33];
          for (let i = heightMix.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [heightMix[i], heightMix[j]] = [heightMix[j], heightMix[i]];
          }
          const nodes = [];
          let peakIndex = 0;
          for (let i = 0; i <= segs; i++) {
            const isPeak = i % 2 === 1;
            const mix = heightMix[peakIndex % heightMix.length];
            if (isPeak) peakIndex++;
            nodes.push({
              x: (W * i) / segs,
              h: isPeak
                ? peakH * mix * (0.9 + Math.random() * 0.2)
                : valleyH * (0.25 + Math.random() * 0.9)
            });
          }
          const terrainHeight = (x) => {
            if (x <= nodes[0].x) return nodes[0].h;
            for (let i = 1; i < nodes.length; i++) {
              if (x <= nodes[i].x) {
                const a = nodes[i - 1];
                const b = nodes[i];
                return a.h + (b.h - a.h) * ((x - a.x) / (b.x - a.x));
              }
            }
            return nodes[nodes.length - 1].h;
          };
          const rBase = Math.max(7, H * 0.055);
          const colStep = rBase * 1.35;
          const rowStep = rBase * 0.72;
          // Silueta de la cordillera: da definición a los picos rellenando los
          // huecos entre monedas. Se baja un poco (rBase * 0.5) para que la
          // punta oscura no sobresalga por encima de las monedas de la cumbre.
          const ridgePath = `M0,${H} ` +
            nodes.map(n => `L${n.x.toFixed(1)},${(baseline - n.h + rBase * 0.5).toFixed(1)}`).join(' ') +
            ` L${W},${H} Z`;
          const segW = W / segs;
          const shadowEllipses = nodes.filter((_, i) => i % 2 === 1).map(n =>
            `<ellipse cx="${n.x.toFixed(1)}" cy="${baseline + 2}" rx="${(segW * 1.15).toFixed(1)}" ry="${(H * 0.05).toFixed(1)}" fill="rgba(0,0,0,0.4)"/>`
          ).join('');
          const floorCoins = [];
          for (let x = -rBase; x <= W + rBase; x += colStep) {
            const topH = terrainHeight(x);
            const topCy = baseline - topH;
            const rows = Math.max(1, Math.round(topH / rowStep));
            for (let r = 0; r < rows; r++) {
              const cy = topCy + (r * rowStep) + Math.random() * rowStep * 0.4;
              if (cy > baseline + 2) continue;
              floorCoins.push({
                cx: (x + (Math.random() - 0.5) * colStep * 0.9).toFixed(1),
                cy,
                rx: (rBase * (0.78 + Math.random() * 0.4)).toFixed(2),
                rot: (Math.random() * 20 - 10).toFixed(1),
                isTop: r === 0
              });
            }
          }
          floorCoins.sort((a, b) => a.cy - b.cy);
          const ridgeSvg = `<path d="${ridgePath}" fill="url(#ridgeGrad)"/>`;
          const floorEllipses = ridgeSvg + shadowEllipses + floorCoins.map(c => {
            const rx = parseFloat(c.rx);
            // Cara bastante redonda (0.62 del ancho): con proporciones más
            // chatas las monedas se leían aplastadas, no como monedas.
            const ry = rx * 0.62;
            const thick = Math.max(2.4, ry * 0.85);
            return `<g transform="translate(${c.cx},${c.cy.toFixed(1)}) rotate(${c.rot})">
              <ellipse cx="0" cy="${thick.toFixed(2)}" rx="${rx}" ry="${ry.toFixed(2)}" fill="#4a3208"/>
              <rect x="${-rx}" y="0" width="${(rx * 2).toFixed(2)}" height="${thick.toFixed(2)}" fill="url(#coinEdgeGrad)"/>
              <rect x="${-rx}" y="0" width="${(rx * 2).toFixed(2)}" height="${thick.toFixed(2)}" fill="url(#coinEdgeShade)"/>
              <ellipse cx="0" cy="0" rx="${rx}" ry="${ry.toFixed(2)}" fill="url(#coinGrad)" stroke="#5c4009" stroke-width="${(rx * 0.06).toFixed(2)}"/>
              <ellipse cx="0" cy="0" rx="${(rx * 0.66).toFixed(2)}" ry="${(ry * 0.66).toFixed(2)}" fill="none" stroke="rgba(122,84,10,0.45)" stroke-width="${(rx * 0.05).toFixed(2)}"/>
              <ellipse cx="${(-rx * 0.16).toFixed(2)}" cy="${(-ry * 0.34).toFixed(2)}" rx="${(rx * 0.46).toFixed(2)}" ry="${(ry * 0.3).toFixed(2)}" fill="rgba(255,255,255,0.45)"/>
            </g>`;
          }).join('');
          // Los destellos van en una capa aparte, dibujada después de todas las
          // monedas y solo sobre las de la superficie: dentro del grupo de cada
          // moneda quedaban tapados por las que se pintan encima.
          const surfaceCoins = floorCoins.filter(c => c.isTop);
          const glints = surfaceCoins
            .filter(() => Math.random() < 0.28)
            .map(c => {
              const rx = parseFloat(c.rx);
              const scale = (rx * 0.075).toFixed(3);
              const gx = (parseFloat(c.cx) + rx * 0.2).toFixed(1);
              const gy = (c.cy - rx * 0.5).toFixed(1);
              return `<g transform="translate(${gx},${gy}) scale(${scale}) translate(-12,-12)"><g class="floor-sparkle" style="animation-delay:${(Math.random() * 3.5).toFixed(2)}s"><path d="${STAR}"/></g></g>`;
            }).join('');
          // Moneda dibujada (no emoji): el emoji 🪙 no existe en todas las
          // fuentes y en varios sistemas salía como un cuadrito oscuro,
          // invisible contra el fondo.
          // La cara va redonda (no elíptica): el achatamiento del giro ahora
          // lo hace la rotación 3D, no el dibujo.
          const fallingCoin = `<svg viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="13" cy="13" r="12.2" fill="url(#coinGrad)" stroke="#5c4009" stroke-width="0.9"/>
            <circle cx="13" cy="13" r="8.2" fill="none" stroke="rgba(122,84,10,0.5)" stroke-width="0.7"/>
            <ellipse cx="9.6" cy="9" rx="4.6" ry="2.8" fill="rgba(255,255,255,0.5)" transform="rotate(-28 9.6 9)"/>
          </svg>`;
          const rainCount = 18;
          const coins = Array.from({ length: rainCount }).map((_, i) => {
            const left = (Math.random() * 94 + 2).toFixed(1);
            const duration = (6 + Math.random() * 4).toFixed(1);
            // Escalonadas dentro de los primeros ~4s (antes hasta 8s, así que
            // al abrir la pantalla casi no se veía ninguna cayendo).
            const delay = ((i / rainCount) * 4 + Math.random() * 0.6).toFixed(1);
            const isSparkle = Math.random() < 0.55;
            const glintDelay = (Math.random() * 1.7).toFixed(2);
            const sparkle = isSparkle ? `<span class="sparkle-glint" style="top:-6px; right:-6px; animation-delay:${glintDelay}s;"><svg viewBox="0 0 24 24"><path d="${STAR}"/></svg></span>` : '';
            // Grosor variado (6.5-8.3px sobre 26px de diámetro: la misma
            // proporción rechoncha que las monedas del suelo, donde el canto
            // mide ~0.26 del diámetro) y velocidad de giro distinta por
            // moneda, unas al derecho y otras al revés.
            const thick = (6.5 + Math.random() * 1.8).toFixed(1);
            const spin = (2.8 + Math.random() * 2.2).toFixed(2);
            const dir = Math.random() < 0.5 ? 'normal' : 'reverse';
            const coin3d = `<span class="coin-3d" style="--thick:${thick}px; --half:${(thick / 2).toFixed(2)}px; animation-duration:${spin}s; animation-direction:${dir};">
              <span class="coin-side"></span>
              <span class="coin-face coin-face-front">${fallingCoin}</span>
              <span class="coin-face coin-face-back">${fallingCoin}</span>
            </span>`;
            return `<span class="coin-rain" style="left:${left}%; --dur:${duration}s; --delay:${delay}s;">${coin3d}${sparkle}</span>`;
          }).join('');
          return `
          <div class="coin-floor" style="height:${H}px">
            <div class="coin-floor-bg"></div>
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
              <defs>
                <radialGradient id="coinGrad" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stop-color="#FFF3B0"/>
                  <stop offset="35%" stop-color="#FFD700"/>
                  <stop offset="75%" stop-color="#D4A017"/>
                  <stop offset="100%" stop-color="#8a6414"/>
                </radialGradient>
                <linearGradient id="coinEdgeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#5c3a09"/>
                  <stop offset="20%" stop-color="#a9761a"/>
                  <stop offset="46%" stop-color="#e0b24a"/>
                  <stop offset="74%" stop-color="#9c6a12"/>
                  <stop offset="100%" stop-color="#4a2f07"/>
                </linearGradient>
                <linearGradient id="coinEdgeShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#000" stop-opacity="0"/>
                  <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
                </linearGradient>
                <linearGradient id="ridgeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8a6414"/>
                  <stop offset="55%" stop-color="#5a3f0d"/>
                  <stop offset="100%" stop-color="#33230a"/>
                </linearGradient>
              </defs>
              ${floorEllipses}
              ${glints}
            </svg>
          </div>
          ${coins}`;
        })() : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'gantt-build' ? (() => {
          const flagColors = ['#E03B2E', '#D8AE6E', '#4E8B8B', '#8C6BAE', '#E8935C', '#5C9BD8', '#7ecfc0'];
          const barColors = ['c-lila', 'c-amarillo', 'c-purpura'];
          const totalRows = 9;
          const rows = Array.from({ length: totalRows }).map((_, i) => {
            // La escalera va en el riel de cada fila, no en el relleno animado:
            // así la piramide se ve siempre, y no solo en el instante en que
            // una barra llega a su ancho maximo (que por el desfase de las
            // animaciones nunca ocurre en todas a la vez).
            const rowW = (34 + (i * 66) / (totalRows - 1)).toFixed(1);
            const w = (80 + Math.random() * 16).toFixed(1);
            const delay = (i * 0.68).toFixed(2);
            const day = Math.floor(Math.random() * 28) + 1;
            const cls = barColors[i % barColors.length];
            const flagColor = flagColors[i % flagColors.length];
            return `<div class="gantt-row" style="width:${rowW}%;">
                <div class="gantt-bar ${cls}" style="--w:${w}%; animation-delay:${delay}s;"></div>
                <span class="gantt-dot ${cls}" style="--w:${w}%; animation-delay:${delay}s;"></span>
                <span class="gantt-date" style="left:${w}%; animation-delay:${delay}s;">${day}</span>
                <span class="gantt-flag" style="left:${w}%; animation-delay:${delay}s;"><svg viewBox="0 0 24 24" style="stroke:${flagColor}"><path d="M5 21V4"/><path d="M5 4.5h13l-3 4 3 4H5"/></svg></span>
              </div>`;
          }).join('');
          return `<div class="gantt-scene">${rows}</div>`;
        })() : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'travel-sky' ? (() => {
          const n = (v) => Number(v).toFixed(1);
          const groundY = 108;

          // --- Ciudad: mas edificios, con formas y alturas distintas.
          // Los mas altos (h >= 78) rebasan las cimas de las montanas.
          const buildings = [
            { x: -4, w: 18, h: 28, type: 'flat' },
            { x: 12, w: 12, h: 44, type: 'antenna' },
            { x: 23, w: 16, h: 20, type: 'pitch' },
            { x: 37, w: 14, h: 34, type: 'step' },
            { x: 49, w: 18, h: 62, type: 'setback' },
            { x: 65, w: 12, h: 26, type: 'flat' },
            { x: 75, w: 16, h: 38, type: 'slant' },
            { x: 89, w: 11, h: 18, type: 'dome' },
            { x: 97, w: 20, h: 52, type: 'step' },
            { x: 115, w: 12, h: 30, type: 'flat' },
            { x: 125, w: 13, h: 88, type: 'antenna' },
            { x: 139, w: 16, h: 32, type: 'pitch' },
            { x: 153, w: 12, h: 24, type: 'flat' },
            { x: 163, w: 18, h: 46, type: 'setback' },
            { x: 181, w: 12, h: 20, type: 'flat' },
            { x: 191, w: 15, h: 36, type: 'step' },
            { x: 205, w: 20, h: 80, type: 'setback' },
            { x: 223, w: 12, h: 22, type: 'dome' },
            { x: 233, w: 16, h: 40, type: 'slant' },
            { x: 247, w: 11, h: 28, type: 'flat' },
            { x: 256, w: 18, h: 58, type: 'antenna' },
            { x: 273, w: 14, h: 24, type: 'pitch' },
            { x: 285, w: 12, h: 34, type: 'flat' },
            { x: 295, w: 20, h: 92, type: 'setback' },
            { x: 313, w: 13, h: 26, type: 'step' },
            { x: 325, w: 16, h: 44, type: 'slant' },
            { x: 339, w: 12, h: 20, type: 'flat' },
            { x: 349, w: 18, h: 64, type: 'antenna' },
            { x: 365, w: 14, h: 30, type: 'dome' },
            { x: 377, w: 16, h: 38, type: 'step' },
            { x: 391, w: 16, h: 22, type: 'flat' }
          ];
          const rect = (x, y, w, h) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/>`;
          const buildingShape = (b) => {
            const top = groundY - b.h;
            switch (b.type) {
              case 'step':
                return rect(b.x, top + 7, b.w, b.h - 7) + rect(b.x + b.w * 0.22, top, b.w * 0.56, 8);
              case 'antenna':
                return rect(b.x, top, b.w, b.h) + rect(b.x + b.w / 2 - 0.7, top - 11, 1.4, 11);
              case 'pitch':
                return rect(b.x, top + 6, b.w, b.h - 6) +
                  `<path d="M${n(b.x - 1)} ${n(top + 6.5)} L${n(b.x + b.w / 2)} ${n(top)} L${n(b.x + b.w + 1)} ${n(top + 6.5)} Z"/>`;
              case 'dome':
                return rect(b.x, top, b.w, b.h) +
                  `<path d="M${n(b.x + 1)} ${n(top + 0.5)} a ${n(b.w / 2 - 1)} ${n(b.w / 2 - 1)} 0 0 1 ${n(b.w - 2)} 0 Z"/>`;
              case 'slant':
                return `<path d="M${n(b.x)} ${n(groundY)} L${n(b.x)} ${n(top + 9)} L${n(b.x + b.w)} ${n(top)} L${n(b.x + b.w)} ${n(groundY)} Z"/>`;
              case 'setback':
                return rect(b.x, groundY - b.h * 0.55, b.w, b.h * 0.55) +
                  rect(b.x + b.w * 0.15, groundY - b.h * 0.85, b.w * 0.7, b.h * 0.3) +
                  rect(b.x + b.w * 0.29, top, b.w * 0.42, b.h * 0.15) +
                  rect(b.x + b.w / 2 - 0.6, top - 8, 1.2, 8);
              default:
                return rect(b.x, top, b.w, b.h);
            }
          };
          const cityPath = rect(-2, groundY, 404, 140 - groundY) + buildings.map(buildingShape).join('');

          // Ventanas encendidas, solo dentro del cuerpo solido de cada edificio.
          const lights = buildings.map((b) => {
            if (b.h < 16) return '';
            const bodyH = b.h * (b.type === 'setback' ? 0.5 : 0.8);
            const cols = Math.max(1, Math.floor((b.w - 4) / 6));
            const rows = Math.max(1, Math.floor((bodyH - 8) / 6));
            const x0 = b.x + (b.w - (cols - 1) * 6) / 2;
            let out = '';
            for (let c = 0; c < cols; c++) {
              for (let r = 0; r < rows; r++) {
                if (Math.random() > 0.42) continue;
                out += `<circle cx="${n(x0 + c * 6)}" cy="${n(groundY - 6 - r * 6)}" r="1.1"/>`;
              }
            }
            return out;
          }).join('');

          // --- Semi bosque al pie de las montanas: dos franjas de arboles.
          const tree = (cx, base, h, kind) => {
            const w = h * 0.55;
            if (kind === 0) {
              return `<path d="M${n(cx)} ${n(base - h)} L${n(cx + w * 0.34)} ${n(base - h * 0.5)} L${n(cx + w * 0.16)} ${n(base - h * 0.5)} L${n(cx + w * 0.5)} ${n(base)} L${n(cx - w * 0.5)} ${n(base)} L${n(cx - w * 0.16)} ${n(base - h * 0.5)} L${n(cx - w * 0.34)} ${n(base - h * 0.5)} Z"/>`;
            }
            if (kind === 1) {
              return `<rect x="${n(cx - 0.6)}" y="${n(base - h * 0.45)}" width="1.2" height="${n(h * 0.45)}"/>` +
                `<ellipse cx="${n(cx)}" cy="${n(base - h * 0.68)}" rx="${n(w * 0.62)}" ry="${n(h * 0.36)}"/>`;
            }
            return `<ellipse cx="${n(cx)}" cy="${n(base - h * 0.3)}" rx="${n(w * 0.8)}" ry="${n(h * 0.34)}"/>` +
              `<ellipse cx="${n(cx - w * 0.45)}" cy="${n(base - h * 0.2)}" rx="${n(w * 0.5)}" ry="${n(h * 0.24)}"/>`;
          };
          const forestBand = (step, baseMin, baseVar, hMin, hVar) => {
            let out = '';
            for (let x = -6; x < 406; x += step) {
              const cx = x + (Math.random() - 0.5) * step * 0.7;
              const base = baseMin + Math.random() * baseVar;
              const h = hMin + Math.random() * hVar;
              const r = Math.random();
              out += tree(cx, base, h, r < 0.6 ? 0 : r < 0.88 ? 1 : 2);
            }
            return out;
          };
          // Franja alta: el bosque que se ve al pie de las montanas, por encima
          // de los edificios bajos. Franja baja: arboles a nivel de la ciudad.
          const forestFar = forestBand(4.5, 92, 6, 7, 9);
          const forestNear = forestBand(6, 102, 6, 10, 14);

          const planeIcon = '<path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/>';
          const planes = [
            { anim: 'fly-1', dur: 15, delay: 0, layer: 'plane-behind', x: 12, y: 62, rot: 55 },
            { anim: 'fly-2', dur: 18, delay: 3, layer: 'plane-front', x: 86, y: 22, rot: 243 },
            { anim: 'fly-3', dur: 13, delay: 7, layer: 'plane-front', x: 18, y: 18, rot: 78 },
            { anim: 'fly-4', dur: 20, delay: 1, layer: 'plane-behind', x: 78, y: 70, rot: 31 },
            { anim: 'fly-5', dur: 17, delay: 5, layer: 'plane-front', x: 8, y: 34, rot: 286 },
            { anim: 'fly-6', dur: 22, delay: 9, layer: 'plane-front', x: 90, y: 52, rot: 323 }
          ];
          const planeEls = planes.map((p) => `<span class="plane ${p.layer}" style="left:${p.x}%; top:${p.y}%; transform:rotate(${p.rot}deg); animation:${p.anim} ${p.dur}s linear infinite; animation-delay:${p.delay}s;"><svg viewBox="0 0 24 24">${planeIcon}</svg></span>`).join('');

          // --- Nubes de pantalla: varias formas distintas, no siempre la misma.
          const cloudShapes = {
            wide: { ratio: 48 / 22, svg: '<svg viewBox="0 0 48 22" fill="#e8f4f2"><ellipse cx="18" cy="14" rx="17" ry="7.5"/><ellipse cx="31" cy="10" rx="12" ry="7"/></svg>' },
            puffy: { ratio: 48 / 24, svg: '<svg viewBox="0 0 48 24" fill="#e8f4f2"><ellipse cx="14" cy="16" rx="12" ry="7"/><ellipse cx="25" cy="11" rx="13" ry="9"/><ellipse cx="36" cy="16" rx="11" ry="6.5"/></svg>' },
            wispy: { ratio: 48 / 14, svg: '<svg viewBox="0 0 48 14" fill="#e8f4f2"><ellipse cx="24" cy="9" rx="23" ry="4"/><ellipse cx="30" cy="6" rx="12" ry="3"/></svg>' },
            puff: { ratio: 24 / 20, svg: '<svg viewBox="0 0 24 20" fill="#e8f4f2"><ellipse cx="12" cy="12" rx="11" ry="7"/><ellipse cx="15" cy="8" rx="7" ry="5"/></svg>' },
            tower: { ratio: 40 / 28, svg: '<svg viewBox="0 0 40 28" fill="#e8f4f2"><ellipse cx="18" cy="21" rx="16" ry="6.5"/><ellipse cx="20" cy="14" rx="12" ry="8"/><ellipse cx="24" cy="8" rx="8" ry="6"/></svg>' },
            flat: { ratio: 56 / 18, svg: '<svg viewBox="0 0 56 18" fill="#e8f4f2"><ellipse cx="20" cy="12" rx="19" ry="5.5"/><ellipse cx="34" cy="9" rx="14" ry="6"/><ellipse cx="46" cy="12" rx="9" ry="4.5"/></svg>' }
          };
          const clouds = [
            { s: 'puffy', left: 6, top: 7, w: 44, dur: 24, delay: 0, op: 0.55 },
            { s: 'wide', left: 26, top: 3, w: 32, dur: 19, delay: -4, op: 0.4 },
            { s: 'wispy', left: 44, top: 9, w: 52, dur: 28, delay: -11, op: 0.32 },
            { s: 'flat', left: 64, top: 4, w: 58, dur: 25, delay: -7, op: 0.5 },
            { s: 'puff', left: 84, top: 11, w: 22, dur: 17, delay: -2, op: 0.42 },
            { s: 'tower', left: 14, top: 19, w: 34, dur: 30, delay: -13, op: 0.45 },
            { s: 'wide', left: 72, top: 20, w: 40, dur: 21, delay: -5, op: 0.5 },
            { s: 'puff', left: 16, top: 29, w: 18, dur: 15, delay: -9, op: 0.3 },
            { s: 'wispy', left: 2, top: 40, w: 46, dur: 33, delay: -3, op: 0.28 },
            { s: 'puffy', left: 88, top: 30, w: 30, dur: 26, delay: -16, op: 0.4 },
            { s: 'flat', left: 78, top: 41, w: 44, dur: 29, delay: -6, op: 0.25 },
            { s: 'puff', left: 6, top: 60, w: 16, dur: 18, delay: -12, op: 0.22 }
          ];
          const cloudEls = clouds.map((c) => {
            const shape = cloudShapes[c.s];
            return `<span class="cloud-el" style="left:${c.left}%; top:${c.top}%; width:${c.w}px; height:${n(c.w / shape.ratio)}px; animation-duration:${c.dur}s; animation-delay:${c.delay}s; opacity:${c.op};">${shape.svg}</span>`;
          }).join('');

          return `
          <div class="travel-skyline">
            <svg viewBox="0 0 400 140" preserveAspectRatio="none">
              <g opacity="0.22" fill="#0e7c7b">
                <path d="M0 140 L0 100 L18 82 L30 90 L42 60 L52 72 L64 25 L74 42 L84 33 L96 58 L112 40 L124 56 L136 15 L146 32 L158 46 L175 70 L192 48 L206 64 L220 30 L232 50 L248 42 L262 60 L280 22 L294 44 L308 36 L322 58 L340 20 L352 40 L368 55 L384 38 L400 52 L400 140Z"/>
              </g>
              <g opacity="0.32" fill="#0e7c7b">
                <path d="M0 140 L0 108 L14 96 L24 100 L36 75 L46 84 L58 45 L68 58 L80 50 L94 72 L108 55 L120 70 L134 38 L144 52 L158 64 L172 82 L190 62 L204 76 L220 48 L234 66 L250 58 L266 74 L284 42 L298 60 L312 52 L328 72 L346 40 L358 58 L374 68 L390 55 L400 66 L400 140Z"/>
              </g>
              <g class="travel-cloud-drift" style="transform-origin:60px 30px;" opacity="0.5" fill="#e8f4f2">
                <ellipse cx="55" cy="30" rx="22" ry="9"/>
                <ellipse cx="68" cy="24" rx="14" ry="8"/>
                <ellipse cx="40" cy="26" rx="12" ry="7"/>
              </g>
              <g class="travel-cloud-drift" style="transform-origin:300px 20px; animation-delay:-4s;" opacity="0.4" fill="#e8f4f2">
                <ellipse cx="300" cy="20" rx="18" ry="7"/>
                <ellipse cx="312" cy="16" rx="11" ry="6"/>
              </g>
              <g class="travel-cloud-drift" style="transform-origin:180px 14px; animation-delay:-9s;" opacity="0.3" fill="#e8f4f2">
                <ellipse cx="176" cy="14" rx="24" ry="5"/>
                <ellipse cx="188" cy="10" rx="13" ry="5"/>
              </g>
              <g class="travel-cloud-drift" style="transform-origin:355px 44px; animation-delay:-14s;" opacity="0.28" fill="#e8f4f2">
                <ellipse cx="352" cy="44" rx="16" ry="6"/>
                <ellipse cx="362" cy="40" rx="10" ry="5"/>
                <ellipse cx="341" cy="41" rx="9" ry="4.5"/>
              </g>
              <g opacity="0.34" fill="#12857f">${forestFar}</g>
              <g opacity="0.62" fill="#0a5152">${forestNear}</g>
              <g fill="#08121c">${cityPath}</g>
              <g fill="#F4C060">${lights}</g>
            </svg>
          </div>
          ${planeEls}
          ${cloudEls}
        `;
        })() : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'mentor-people' ? (() => {
          // Cordillera ascendente: cada cima mas alta que la anterior, alternando
          // capa de atras / adelante para que se vean entrelazadas.
          const peaks = [
            { x: 11, y: 76, hw: 22, layer: 'back' },
            { x: 27, y: 63, hw: 22, layer: 'front' },
            { x: 43, y: 50, hw: 22, layer: 'back' },
            { x: 59, y: 37, hw: 23, layer: 'front' },
            { x: 75, y: 23, hw: 23, layer: 'back' },
            { x: 91, y: 7, hw: 22, layer: 'front' }
          ];
          const n = (v) => v.toFixed(2);
          const mountain = (m) => {
            const back = m.layer === 'back';
            const h = 100 - m.y;
            const left = m.x - m.hw, right = m.x + m.hw;
            const capRatio = 0.2;
            const capHalf = m.hw * capRatio;
            const capY = m.y + h * capRatio;
            const lit = back ? 'url(#mtnLitBack)' : 'url(#mtnLitFront)';
            const shade = back ? 'url(#mtnShadeBack)' : 'url(#mtnShadeFront)';
            // Caras: la izquierda recibe la luz, la derecha queda en sombra.
            const faceL = `M${n(left)} 100 L${n(m.x)} ${n(m.y)} L${n(m.x)} 100 Z`;
            const faceR = `M${n(m.x)} ${n(m.y)} L${n(right)} 100 L${n(m.x)} 100 Z`;
            // Nieve en la cima con borde inferior irregular.
            const cap = `M${n(m.x - capHalf)} ${n(capY)}`
              + ` L${n(m.x - capHalf * 0.5)} ${n(capY - h * capRatio * 0.34)}`
              + ` L${n(m.x - capHalf * 0.12)} ${n(capY - h * capRatio * 0.08)}`
              + ` L${n(m.x + capHalf * 0.3)} ${n(capY - h * capRatio * 0.46)}`
              + ` L${n(m.x + capHalf * 0.68)} ${n(capY - h * capRatio * 0.14)}`
              + ` L${n(m.x + capHalf)} ${n(capY)}`
              + ` L${n(m.x)} ${n(m.y)} Z`;
            // Relieve: espina central, filo iluminado y grietas en cada cara.
            const creases = [
              `M${n(m.x)} ${n(m.y)} L${n(m.x)} 100`,
              `M${n(m.x - m.hw * 0.52)} 100 L${n(m.x - m.hw * 0.2)} ${n(m.y + h * 0.46)}`,
              `M${n(m.x - m.hw * 0.82)} 100 L${n(m.x - m.hw * 0.46)} ${n(m.y + h * 0.66)}`,
              `M${n(m.x + m.hw * 0.5)} 100 L${n(m.x + m.hw * 0.19)} ${n(m.y + h * 0.44)}`,
              `M${n(m.x + m.hw * 0.84)} 100 L${n(m.x + m.hw * 0.44)} ${n(m.y + h * 0.7)}`
            ];
            return `<g>
              <path d="${faceL}" fill="${lit}"/>
              <path d="${faceR}" fill="${shade}"/>
              <path d="${cap}" fill="rgba(226,242,238,0.82)"/>
              <path d="${creases[0]}" fill="none" stroke="rgba(0,0,0,0.32)" stroke-width="1" vector-effect="non-scaling-stroke"/>
              <path d="${creases[1]}" fill="none" stroke="rgba(255,255,255,0.11)" stroke-width="1" vector-effect="non-scaling-stroke"/>
              <path d="${creases[2]}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" vector-effect="non-scaling-stroke"/>
              <path d="${creases[3]}" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="1" vector-effect="non-scaling-stroke"/>
              <path d="${creases[4]}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1" vector-effect="non-scaling-stroke"/>
              <path d="M${n(left)} 100 L${n(m.x)} ${n(m.y)}" fill="none" stroke="rgba(190,224,216,0.30)" stroke-width="1.1" vector-effect="non-scaling-stroke"/>
            </g>`;
          };
          const grad = (id, from, to) => `<linearGradient id="${id}" x1="0" y1="0" x2="0.25" y2="1">`
            + `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
          const checkSvg = '<svg viewBox="0 0 24 24"><path d="M4 12.5l5.5 6L20 5.5"/></svg>';
          const crossSvg = '<svg viewBox="0 0 24 24"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>';
          // Las marcas van al centro de la cara de cada montaña.
          const markPos = peaks.map(m => ({ x: m.x, y: m.y + (100 - m.y) * 0.5 }));
          const marks = [
            { cls: 'check c1', i: 0, svg: checkSvg },
            { cls: 'check c2', i: 1, svg: checkSvg },
            { cls: 'check c3', i: 2, svg: checkSvg },
            { cls: 'check c4', i: 3, svg: checkSvg },
            { cls: 'check c5', i: 4, svg: checkSvg },
            { cls: 'check c6', i: 5, svg: checkSvg },
            { cls: 'cross x3', i: 2, svg: crossSvg },
            { cls: 'cross x5', i: 4, svg: crossSvg }
          ];
          // Fuegos artificiales chiquitos sobre la cima, para la celebración final.
          const burst = (color) => {
            const rays = [], dots = [];
            for (let k = 0; k < 12; k++) {
              const a = k * 30 * Math.PI / 180;
              const r2 = 16 + (k % 3) * 2;
              rays.push(`<line x1="${n(20 + Math.cos(a) * 5)}" y1="${n(20 + Math.sin(a) * 5)}"`
                + ` x2="${n(20 + Math.cos(a) * r2)}" y2="${n(20 + Math.sin(a) * r2)}"/>`);
              dots.push(`<circle cx="${n(20 + Math.cos(a) * (r2 + 2.5))}" cy="${n(20 + Math.sin(a) * (r2 + 2.5))}" r="1.1"/>`);
            }
            return `<svg viewBox="0 0 40 40">`
              + `<g stroke="${color}" stroke-width="1.5" stroke-linecap="round">${rays.join('')}</g>`
              + `<g fill="${color}">${dots.join('')}</g></svg>`;
          };
          const fireworks = [
            { cls: 'fw1', x: 82, y: -5, color: '#D8AE6E' },
            { cls: 'fw2', x: 97, y: -1, color: '#7ecfc0' },
            { cls: 'fw3', x: 89, y: -14, color: '#fff9e6' }
          ];
          return `
          <div class="growth-scene">
            <svg class="growth-range" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                ${grad('mtnLitBack', '#4a6b64', '#2b433e')}
                ${grad('mtnShadeBack', '#31504a', '#1e3430')}
                ${grad('mtnLitFront', '#3d6159', '#233f3a')}
                ${grad('mtnShadeFront', '#264541', '#152b27')}
              </defs>
              ${peaks.filter(m => m.layer === 'back').map(mountain).join('')}
              ${peaks.filter(m => m.layer === 'front').map(mountain).join('')}
            </svg>
            ${marks.map(mk => `<span class="growth-mark ${mk.cls}" style="left:${markPos[mk.i].x}%; top:${n(markPos[mk.i].y)}%;">${mk.svg}</span>`).join('')}
            ${fireworks.map(f => `<span class="firework ${f.cls}" style="left:${f.x}%; top:${f.y}%;">${burst(f.color)}</span>`).join('')}
            <div class="hop-figure">
              <svg viewBox="0 0 24 32">
                <path d="M12 2.5 C16 2.5 16.6 6 15.4 9.4 C19.2 11.2 19.6 17 18 21.2 C16.8 26.6 14.2 29.5 12 29.5 C9.8 29.5 7.2 26.6 6 21.2 C4.4 17 4.8 11.2 8.6 9.4 C7.4 6 8 2.5 12 2.5 Z" fill="#fff9e6"/>
                <ellipse cx="10.2" cy="5.6" rx="1.3" ry="0.9" fill="rgba(255,255,255,0.55)"/>
                <path class="hop-arm" d="M16.4 17.2 C18.6 16.3 20.2 14.9 20.8 13.4" fill="none" stroke="#fff9e6" stroke-width="2.2" stroke-linecap="round"/>
                <circle class="hop-hand" cx="21.3" cy="12.6" r="2" fill="#fff9e6"/>
              </svg>
              <div class="growth-flag">
                <svg viewBox="0 0 24 24"><path d="M5 21V4"/><path d="M5 4.5h13l-3 4 3 4H5"/></svg>
              </div>
            </div>
          </div>
          `;
        })() : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'interview' ? (() => {
          const names = ['clipboard', 'magnifier', 'briefcase', 'chat-bubble', 'target', 'gear', 'graduation-cap', 'pencil', 'compass', 'trending-up', 'book', 'lightbulb', 'people', 'star', 'calendar', 'clock', 'bar-chart', 'flag'];
          const colors = ['#E03B2E', '#D8AE6E', '#4E8B8B', '#8C6BAE', '#E8935C', '#5C9BD8', '#7ecfc0'];
          const cells = scatterCells(36);
          return cells.map((cell, i) => {
            const name = names[i % names.length];
            const svgPath = ICONS[name];
            if (!svgPath) return '';
            const color = colors[i % colors.length];
            const size = 1.7 + Math.random() * 1.0;
            const pos = `top:${cell.top.toFixed(1)}%; left:${cell.left.toFixed(1)}%; width:${size.toFixed(2)}rem; height:${size.toFixed(2)}rem;`;
            const delay = (i % 14) * 0.14 + Math.random() * 0.3;
            return `<span class="interview-icon" aria-hidden="true" style="${pos}"><span class="interview-icon-float" style="animation-delay:-${delay.toFixed(2)}s"><svg viewBox="0 0 24 24" style="stroke:${color}">${svgPath}</svg></span></span>`;
          }).join('');
        })() : ''}
        ${!window.AIAPPS_LOGIN_SCENE ? (() => {
          const decoNames = window.AIAPPS_LOGIN_DECORATIONS || [];
          // Se itera sobre las celdas, no sobre los nombres: `scatterCells` puede
          // devolver menos posiciones de las pedidas si no todas entran.
          return scatterCells(decoNames.length).map((cell, i) => {
            const iconName = decoNames[i];
            const svgPath = ICONS[iconName];
            if (!svgPath) return '';
            const size = 1.7 + Math.random() * 1.1;
            const pos = `top:${cell.top.toFixed(1)}%; left:${cell.left.toFixed(1)}%; width:${size.toFixed(2)}rem; height:${size.toFixed(2)}rem;`;
            const delay = (i % 8) * 0.55;
            return `<span class="deco" aria-hidden="true" style="${pos}"><span class="deco-float" style="animation-delay:${delay}s"><svg viewBox="0 0 24 24">${svgPath}</svg></span></span>`;
          }).join('');
        })() : ''}
        <form class="card">
          ${window.AIAPPS_APP_NAME ? `
          <div class="brand">
            ${window.AIAPPS_APP_LOGO_URL ? `<img class="brand-logo-img" src="${window.AIAPPS_APP_LOGO_URL}" alt="" onerror="this.style.display='none';this.nextElementSibling.querySelector('.brand-fallback-emoji').style.display='inline';">` : ''}
            <div class="brand-mark">${(() => {
              if (window.AIAPPS_APP_LOGO_URL && window.AIAPPS_APP_EMOJI) {
                return `<span class="brand-fallback-emoji" style="display:none">${window.AIAPPS_APP_EMOJI} </span>`;
              }
              if (window.AIAPPS_LOGO_BARS) {
                return `<span class="logo-bars" aria-hidden="true"><svg viewBox="0 0 24 24">
                  <rect class="lb-1" x="3" y="4" width="5" height="16" rx="1.4"/>
                  <rect class="lb-2" x="9.5" y="4" width="5" height="16" rx="1.4"/>
                  <rect class="lb-3" x="16" y="4" width="5" height="16" rx="1.4"/>
                </svg></span> `;
              }
              if (!window.AIAPPS_APP_EMOJI) return '';
              if (window.AIAPPS_LOGO_COINS) {
                return `<span class="emoji-wrap">${window.AIAPPS_APP_EMOJI}<span class="coin">🪙</span><span class="coin">🪙</span><span class="coin">🪙</span></span> `;
              }
              if (window.AIAPPS_LOGO_PLANE) {
                return `<span class="logo-plane" aria-hidden="true"><svg class="lp-cloud lp-cloud-1" viewBox="0 0 40 18"><ellipse cx="15" cy="11" rx="14" ry="5.5"/><ellipse cx="26" cy="8" rx="10" ry="5.5"/></svg><span class="lp-glyph">${window.AIAPPS_APP_EMOJI}</span><svg class="lp-cloud lp-cloud-2" viewBox="0 0 28 16"><ellipse cx="12" cy="10" rx="11" ry="5"/><ellipse cx="20" cy="7" rx="7" ry="4.5"/></svg></span>`;
              }
              return window.AIAPPS_APP_EMOJI + ' ';
            })()}<span style="color:${window.AIAPPS_APP_ACCENT || '#B8863B'}">${window.AIAPPS_APP_NAME}</span></div>
            ${window.AIAPPS_APP_TAGLINE ? `<p class="brand-tagline">${window.AIAPPS_APP_TAGLINE}</p>` : ''}
          </div>
          ` : ''}
          <h1 class="title">Iniciar sesión</h1>
          <label for="aiapps-email">Correo</label>
          <input id="aiapps-email" type="email" autocomplete="username" required>
          <div class="pw-field">
            <label for="aiapps-password">Contraseña</label>
            <input id="aiapps-password" type="password" autocomplete="current-password">
          </div>
          <button type="submit">Entrar</button>
          <div class="error"></div>
          <div class="ok"></div>
          <div class="link-row"><button type="button" class="toggle-mode">¿Olvidaste tu contraseña?</button></div>
        </form>
      </div>
    `;

    document.body.appendChild(host);
    lockBackground(host);

    const coverEl = shadow.querySelector(".cover");
    const cardEl = shadow.querySelector(".card");
    coverEl.addEventListener("mousemove", (e) => {
      const rect = coverEl.getBoundingClientRect();
      coverEl.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
      coverEl.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");

      const cardRect = cardEl.getBoundingClientRect();
      const dx = (e.clientX - (cardRect.left + cardRect.width / 2)) / (cardRect.width / 2);
      const dy = (e.clientY - (cardRect.top + cardRect.height / 2)) / (cardRect.height / 2);
      const maxTilt = 6;
      cardEl.style.transform = `perspective(800px) rotateX(${(-dy * maxTilt).toFixed(2)}deg) rotateY(${(dx * maxTilt).toFixed(2)}deg)`;
    });
    coverEl.addEventListener("mouseleave", () => {
      cardEl.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });

    // Red de seguridad: scatterCells() calcula la caja de la tarjeta a partir
    // de su CSS, y ya se equivocó una vez (no contaba el padding). En vez de
    // confiar de nuevo en el cálculo, acá se mide la tarjeta real ya pintada
    // y se oculta cualquier icono que de verdad la toque.
    const cardBox = cardEl.getBoundingClientRect();
    if (cardBox.width > 0) {
      shadow.querySelectorAll(".interview-icon, .deco").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > cardBox.left && r.left < cardBox.right && r.bottom > cardBox.top && r.top < cardBox.bottom) {
          el.style.display = "none";
        }
      });
    }

    // Cada 2 segundos, dos iconos al azar hacen el mismo zoom que al pasar el mouse,
    // sin que el usuario tenga que tocarlos.
    const focusables = Array.from(shadow.querySelectorAll(".interview-icon, .deco")).filter((el) => el.style.display !== "none");
    if (focusables.length >= 2) {
      host._aiappsTimers = host._aiappsTimers || [];
      host._aiappsCleanups = host._aiappsCleanups || [];
      const motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
      let focusTimer = null;

      function startAutoFocus() {
        if (focusTimer !== null) return;
        focusTimer = setInterval(() => {
          const pool = focusables.filter((el) => !el.classList.contains("auto-focus"));
          if (pool.length < 2) return;
          const first = Math.floor(Math.random() * pool.length);
          let second = Math.floor(Math.random() * (pool.length - 1));
          if (second >= first) second++;
          [pool[first], pool[second]].forEach((el) => {
            el.classList.add("auto-focus");
            setTimeout(() => el.classList.remove("auto-focus"), 1200);
          });
        }, 2000);
        host._aiappsTimers.push(focusTimer);
      }

      function stopAutoFocus() {
        if (focusTimer === null) return;
        clearInterval(focusTimer);
        host._aiappsTimers = host._aiappsTimers.filter((id) => id !== focusTimer);
        focusTimer = null;
        focusables.forEach((el) => el.classList.remove("auto-focus"));
      }

      if (!(motionQuery && motionQuery.matches)) startAutoFocus();

      // La preferencia se puede activar con el login ya abierto: sin este
      // listener, el zoom que ya arrancó seguiría corriendo hasta recargar.
      if (motionQuery && motionQuery.addEventListener) {
        const onMotionChange = (e) => { if (e.matches) stopAutoFocus(); else startAutoFocus(); };
        motionQuery.addEventListener("change", onMotionChange);
        host._aiappsCleanups.push(() => motionQuery.removeEventListener("change", onMotionChange));
      }
    }

    const form = shadow.querySelector("form");
    const titleEl = shadow.querySelector(".title");
    const errorEl = shadow.querySelector(".error");
    const okEl = shadow.querySelector(".ok");
    const button = shadow.querySelector('button[type="submit"]');
    const toggleModeLink = shadow.querySelector(".toggle-mode");
    const pwField = shadow.querySelector(".pw-field");
    const pwInput = shadow.getElementById("aiapps-password");
    const emailInput = shadow.getElementById("aiapps-email");

    // Que el foco arranque dentro del candado y no en el final del documento.
    emailInput.focus();

    let mode = "login";

    function setMode(newMode) {
      mode = newMode;
      errorEl.textContent = "";
      okEl.textContent = "";
      if (mode === "login") {
        titleEl.textContent = "Iniciar sesión";
        pwField.classList.remove("hidden");
        pwInput.setAttribute("required", "required");
        button.textContent = "Entrar";
        toggleModeLink.textContent = "¿Olvidaste tu contraseña?";
      } else {
        titleEl.textContent = "Recuperar contraseña";
        pwField.classList.add("hidden");
        pwInput.removeAttribute("required");
        button.textContent = "Enviar enlace";
        toggleModeLink.textContent = "Volver a iniciar sesión";
      }
    }

    toggleModeLink.addEventListener("click", () => setMode(mode === "login" ? "recover" : "login"));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      okEl.textContent = "";
      const email = emailInput.value.trim();

      if (mode === "recover") {
        button.disabled = true;
        button.textContent = "Enviando...";
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: location.href });
        button.disabled = false;
        button.textContent = "Enviar enlace";
        if (error) {
          errorEl.textContent = error.message;
          return;
        }
        okEl.textContent = "Revisa tu correo para continuar.";
        return;
      }

      button.disabled = true;
      button.textContent = "Entrando...";
      const password = pwInput.value;
      const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        errorEl.textContent = "Correo o contraseña incorrectos.";
        button.disabled = false;
        button.textContent = "Entrar";
        return;
      }
      location.reload();
    });

    return host;
  }

  function buildSetNewPasswordOverlay() {
    removeExistingOverlay();
    const host = document.createElement("div");
    host.id = "aiapps-auth-gate";
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647;";
    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        .cover{
          position:fixed; inset:0;
          background:#131B23;
          display:flex; align-items:center; justify-content:center;
          font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
        }
        .card{
          width:min(320px, 90vw);
          background:#EFEADC;
          border-radius:6px;
          padding:32px 28px;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
        }
        h1{ font-size:1.1rem; margin:0 0 18px; color:#1B2430; text-align:center; }
        label{ display:block; font-size:0.75rem; color:#3E4757; margin:14px 0 4px; }
        input{
          width:100%; box-sizing:border-box; padding:9px 10px;
          border:1px solid #C9C2AC; border-radius:4px; font-size:0.95rem;
          background:#fff; color:#1B2430;
        }
        button{
          width:100%; margin-top:20px; padding:10px; border:none; border-radius:4px;
          background:#B8863B; color:#fff; font-size:0.9rem; font-weight:600; cursor:pointer;
        }
        button:disabled{ opacity:0.6; cursor:default; }
        .error{ margin-top:12px; font-size:0.8rem; color:#B8433B; min-height:1em; text-align:center; }
      </style>
      <div class="cover">
        <form class="card">
          <h1>Elige una contraseña nueva</h1>
          <label for="aiapps-recovery-password">Nueva contraseña</label>
          <input id="aiapps-recovery-password" type="password" autocomplete="new-password" minlength="6" required placeholder="mínimo 6 caracteres">
          <button type="submit">Guardar</button>
          <div class="error"></div>
        </form>
      </div>
    `;

    document.body.appendChild(host);
    lockBackground(host);

    const form = shadow.querySelector("form");
    const errorEl = shadow.querySelector(".error");
    const button = shadow.querySelector("button");
    const pwInput = shadow.getElementById("aiapps-recovery-password");
    pwInput.focus();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      const newPassword = pwInput.value;
      if (newPassword.length < 6) {
        errorEl.textContent = "Mínimo 6 caracteres.";
        return;
      }
      button.disabled = true;
      button.textContent = "Guardando...";
      const { error } = await window.supabaseClient.auth.updateUser({ password: newPassword });
      if (error) {
        errorEl.textContent = error.message;
        button.disabled = false;
        button.textContent = "Guardar";
        return;
      }
      location.reload();
    });
  }

  function buildAccountWidget() {
    const host = document.createElement("div");
    host.id = "aiapps-account-widget";
    host.style.cssText = "position:fixed;top:14px;right:14px;z-index:2147483646;";
    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host{ font-family:system-ui,-apple-system,'Segoe UI',sans-serif; }
        .toggle{
          background:#1B2430;
          color:#F1EDE4;
          border:1px solid rgba(255,255,255,0.12);
          border-radius:999px;
          padding:8px 14px;
          font-size:12.5px;
          cursor:pointer;
          box-shadow:0 6px 20px rgba(0,0,0,0.35);
        }
        .panel{
          display:none;
          margin-top:8px;
          width:230px;
          background:#EFEADC;
          border-radius:8px;
          padding:16px;
          box-shadow:0 14px 34px rgba(0,0,0,0.4);
        }
        .panel.open{ display:block; }
        label{
          display:block;
          font-size:0.72rem;
          color:#3E4757;
          margin:0 0 4px;
        }
        input{
          width:100%;
          box-sizing:border-box;
          padding:7px 9px;
          border:1px solid #C9C2AC;
          border-radius:4px;
          font-size:0.85rem;
          background:#fff;
          color:#1B2430;
        }
        .save-btn{
          width:100%;
          margin-top:10px;
          padding:8px;
          border:none;
          border-radius:4px;
          background:#B8863B;
          color:#fff;
          font-size:0.82rem;
          font-weight:600;
          cursor:pointer;
        }
        .save-btn:disabled{ opacity:0.6; cursor:default; }
        .logout-btn{
          width:100%;
          margin-top:8px;
          padding:8px;
          border:1px solid #C9C2AC;
          border-radius:4px;
          background:transparent;
          color:#1B2430;
          font-size:0.82rem;
          cursor:pointer;
        }
        .msg{
          margin-top:8px;
          font-size:0.72rem;
          min-height:1em;
          text-align:center;
        }
        .msg.error{ color:#B8433B; }
        .msg.ok{ color:#4E8B8B; }
      </style>
      <button class="toggle">👤 Cuenta</button>
      <div class="panel">
        <label for="aiapps-new-password">Nueva contraseña</label>
        <input id="aiapps-new-password" type="password" autocomplete="new-password" minlength="6" placeholder="mínimo 6 caracteres">
        <button class="save-btn">Cambiar contraseña</button>
        <button class="logout-btn">Cerrar sesión</button>
        <div class="msg"></div>
      </div>
    `;

    document.body.appendChild(host);

    const toggle = shadow.querySelector(".toggle");
    const panel = shadow.querySelector(".panel");
    const saveBtn = shadow.querySelector(".save-btn");
    const logoutBtn = shadow.querySelector(".logout-btn");
    const msgEl = shadow.querySelector(".msg");
    const pwInput = shadow.getElementById("aiapps-new-password");

    toggle.addEventListener("click", () => panel.classList.toggle("open"));

    saveBtn.addEventListener("click", async () => {
      const newPassword = pwInput.value;
      msgEl.textContent = "";
      msgEl.className = "msg";
      if (newPassword.length < 6) {
        msgEl.textContent = "Mínimo 6 caracteres.";
        msgEl.className = "msg error";
        return;
      }
      saveBtn.disabled = true;
      saveBtn.textContent = "Guardando...";
      const { error } = await window.supabaseClient.auth.updateUser({ password: newPassword });
      saveBtn.disabled = false;
      saveBtn.textContent = "Cambiar contraseña";
      if (error) {
        msgEl.textContent = error.message;
        msgEl.className = "msg error";
        return;
      }
      pwInput.value = "";
      msgEl.textContent = "Contraseña actualizada.";
      msgEl.className = "msg ok";
    });

    logoutBtn.addEventListener("click", () => window.aiAppsSignOut());
  }

  function buildConnectionErrorOverlay() {
    const host = document.createElement("div");
    host.id = "aiapps-auth-gate";
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647;";
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        .cover{
          position:fixed; inset:0;
          background:#131B23;
          display:flex; align-items:center; justify-content:center;
          font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
        }
        .card{
          width:min(320px, 90vw);
          background:#EFEADC;
          border-radius:6px;
          padding:32px 28px;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
          text-align:center;
          color:#1B2430;
        }
        h1{ font-size:1.05rem; margin:0 0 10px; }
        p{ font-size:0.85rem; color:#3E4757; margin:0; line-height:1.4; }
      </style>
      <div class="cover">
        <div class="card" tabindex="-1" role="alertdialog" aria-labelledby="aiapps-conn-title">
          <h1 id="aiapps-conn-title">No se pudo conectar</h1>
          <p>No se pudo cargar el sistema de acceso. Verifica tu conexión a internet y recarga la página.</p>
        </div>
      </div>
    `;
    document.body.appendChild(host);
    lockBackground(host);
    shadow.querySelector(".card").focus();
  }

  async function guard() {
    if (!window.supabaseClient) {
      console.warn("[AI APPs] auth-gate.js: supabaseClient no está configurado todavía.");
      buildConnectionErrorOverlay();
      return;
    }

    let recoveryInProgress = false;
    window.supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        recoveryInProgress = true;
        buildSetNewPasswordOverlay();
      }
    });

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (recoveryInProgress) return;
    if (!session) {
      buildOverlay();
      return;
    }
    if (window.AIAPPS_SHOW_ACCOUNT_WIDGET) buildAccountWidget();
  }

  window.aiAppsSignOut = async function () {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    location.reload();
  };

  whenReady(guard);
})();
