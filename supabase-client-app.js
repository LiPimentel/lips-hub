/* ===== AI APPs · Cliente de Supabase por app (sesión independiente) =====
   Cada app define window.AIAPPS_APP_ID antes de cargar este archivo.
   Cada app_id usa su propia "storageKey", así que la sesión de cada
   app queda completamente separada de las demás y del hub - aunque
   todas usan el mismo proyecto de Supabase.
   (La URL/clave están duplicadas respecto a supabase-client.js a propósito:
   son dos archivos independientes sin sistema de módulos, y son valores públicos.) */
(function () {
  const SUPABASE_URL = "https://mkliirscqulfrutmjncu.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGlpcnNjcXVsZnJ1dG1qbmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDE0NzcsImV4cCI6MjA5OTg3NzQ3N30.4Qk-hH3NjawJX1eGQtzPnPOtwE9RieK42pjLxR0t65s";

  const VALID_APP_IDS = ["mentor", "staffgate", "lpbag", "mytravel", "gantt"];
  const appId = window.AIAPPS_APP_ID;

  if (!appId || VALID_APP_IDS.indexOf(appId) === -1) {
    console.error("[AI APPs] supabase-client-app.js: window.AIAPPS_APP_ID inválido o no definido ('" + appId + "'). Debe ser uno de: " + VALID_APP_IDS.join(", "));
    return;
  }

  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storageKey: "sb-" + appId + "-auth",
      persistSession: true,
      autoRefreshToken: true
    }
  });
})();
