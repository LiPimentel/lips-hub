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

  function buildOverlay() {
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
        h1{
          font-size:1.1rem;
          margin:0 0 18px;
          color:#1B2430;
          text-align:center;
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
      </style>
      <div class="cover">
        <form class="card">
          <h1>Iniciar sesión</h1>
          <label for="aiapps-email">Correo</label>
          <input id="aiapps-email" type="email" autocomplete="username" required>
          <label for="aiapps-password">Contraseña</label>
          <input id="aiapps-password" type="password" autocomplete="current-password" required>
          <button type="submit">Entrar</button>
          <div class="error"></div>
        </form>
      </div>
    `;

    document.body.appendChild(host);

    const form = shadow.querySelector("form");
    const errorEl = shadow.querySelector(".error");
    const button = shadow.querySelector("button");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      button.disabled = true;
      button.textContent = "Entrando...";
      const email = shadow.getElementById("aiapps-email").value.trim();
      const password = shadow.getElementById("aiapps-password").value;
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

  async function guard() {
    if (!window.supabaseClient) {
      console.warn("[AI APPs] auth-gate.js: supabaseClient no está configurado todavía; se omite el candado.");
      return;
    }
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) buildOverlay();
  }

  window.aiAppsSignOut = async function () {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    location.reload();
  };

  whenReady(guard);
})();
