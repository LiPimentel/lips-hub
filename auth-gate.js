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
            radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(184,134,59,0.16), transparent 45%),
            #131B23;
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
      </style>
      <div class="cover">
        <form class="card">
          ${window.AIAPPS_APP_NAME ? `
          <div class="brand">
            ${window.AIAPPS_APP_LOGO_URL ? `<img class="brand-logo-img" src="${window.AIAPPS_APP_LOGO_URL}" alt="" onerror="this.style.display='none';this.nextElementSibling.querySelector('.brand-fallback-emoji').style.display='inline';">` : ''}
            <div class="brand-mark">${window.AIAPPS_APP_LOGO_URL && window.AIAPPS_APP_EMOJI ? `<span class="brand-fallback-emoji" style="display:none">${window.AIAPPS_APP_EMOJI} </span>` : (window.AIAPPS_APP_EMOJI ? window.AIAPPS_APP_EMOJI + ' ' : '')}<span style="color:${window.AIAPPS_APP_ACCENT || '#B8863B'}">${window.AIAPPS_APP_NAME}</span></div>
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
