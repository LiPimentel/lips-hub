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

  function removeExistingOverlay() {
    const existing = document.getElementById("aiapps-auth-gate");
    if (existing) existing.remove();
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
          font-size:1.5rem;
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
        .emoji-wrap{ position:relative; display:inline-block; }
        .coin{
          position:absolute;
          left:50%;
          bottom:2px;
          font-size:0.85rem;
          opacity:0;
          animation:coin-pop 1.6s ease-in infinite;
          pointer-events:none;
        }
        .coin:nth-child(1){ --cx:24px; animation-delay:0s; }
        .coin:nth-child(2){ --cx:-20px; animation-delay:0.5s; }
        .coin:nth-child(3){ --cx:6px; animation-delay:1s; }
        @keyframes coin-pop{
          0%{ opacity:0; transform:translate(-50%,0) scale(0.4) rotate(0deg); }
          18%{ opacity:1; transform:translate(-50%,-16px) scale(0.9) rotate(70deg); }
          100%{ opacity:0; transform:translate(calc(-50% + var(--cx,20px)),28px) scale(0.6) rotate(320deg); }
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
        .link-row a{
          font-size:0.78rem;
          color:#8B94A3;
          cursor:pointer;
          text-decoration:underline;
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
        .deco:hover{
          opacity:0.8;
          transform:scale(1.35) rotate(-8deg);
        }
        @keyframes deco-float{
          0%, 100% { transform:translateY(0) rotate(0deg); }
          50% { transform:translateY(-9px) rotate(5deg); }
        }
      </style>
      <div class="cover">
        ${(window.AIAPPS_LOGIN_DECORATIONS || []).map((iconName, i) => {
          const cols = [3, 12, 21, 79, 88, 97];
          const rows = [4, 14, 24, 76, 86, 96];
          const cells = [];
          rows.forEach(top => cols.forEach(left => cells.push({ top, left })));
          const svgPath = ICONS[iconName];
          if (!svgPath) return '';
          const cell = cells[i % cells.length];
          const jitterTop = (Math.random() - 0.5) * 12;
          const jitterLeft = (Math.random() - 0.5) * 8;
          const size = 1.7 + Math.random() * 1.1;
          const pos = `top:${(cell.top + jitterTop).toFixed(1)}%; left:${(cell.left + jitterLeft).toFixed(1)}%; width:${size.toFixed(2)}rem; height:${size.toFixed(2)}rem;`;
          const delay = (i % 8) * 0.55;
          return `<span class="deco" style="${pos}"><span class="deco-float" style="animation-delay:${delay}s"><svg viewBox="0 0 24 24">${svgPath}</svg></span></span>`;
        }).join('')}
        <form class="card">
          ${window.AIAPPS_APP_NAME ? `
          <div class="brand">
            ${window.AIAPPS_APP_LOGO_URL ? `<img class="brand-logo-img" src="${window.AIAPPS_APP_LOGO_URL}" alt="" onerror="this.style.display='none';this.nextElementSibling.querySelector('.brand-fallback-emoji').style.display='inline';">` : ''}
            <div class="brand-mark">${(() => {
              if (window.AIAPPS_APP_LOGO_URL && window.AIAPPS_APP_EMOJI) {
                return `<span class="brand-fallback-emoji" style="display:none">${window.AIAPPS_APP_EMOJI} </span>`;
              }
              if (!window.AIAPPS_APP_EMOJI) return '';
              if (window.AIAPPS_LOGO_COINS) {
                return `<span class="emoji-wrap">${window.AIAPPS_APP_EMOJI}<span class="coin">🪙</span><span class="coin">🪙</span><span class="coin">🪙</span></span> `;
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
          <div class="link-row"><a class="toggle-mode">¿Olvidaste tu contraseña?</a></div>
        </form>
      </div>
    `;

    document.body.appendChild(host);

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

    const form = shadow.querySelector("form");
    const titleEl = shadow.querySelector(".title");
    const errorEl = shadow.querySelector(".error");
    const okEl = shadow.querySelector(".ok");
    const button = shadow.querySelector("button");
    const toggleModeLink = shadow.querySelector(".toggle-mode");
    const pwField = shadow.querySelector(".pw-field");
    const pwInput = shadow.getElementById("aiapps-password");
    const emailInput = shadow.getElementById("aiapps-email");

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

    const form = shadow.querySelector("form");
    const errorEl = shadow.querySelector(".error");
    const button = shadow.querySelector("button");
    const pwInput = shadow.getElementById("aiapps-recovery-password");

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
        <div class="card">
          <h1>No se pudo conectar</h1>
          <p>No se pudo cargar el sistema de acceso. Verifica tu conexión a internet y recarga la página.</p>
        </div>
      </div>
    `;
    document.body.appendChild(host);
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
