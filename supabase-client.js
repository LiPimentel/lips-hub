/* ===== AI APPs · Cliente compartido de Supabase =====
   Un solo lugar con la URL y la clave del proyecto.
   Todas las páginas (hub y apps) cargan este archivo, así que
   la sesión de inicio de sesión se comparte automáticamente entre ellas. */
(function () {
  const SUPABASE_URL = "https://mkliirscqulfrutmjncu.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGlpcnNjcXVsZnJ1dG1qbmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDE0NzcsImV4cCI6MjA5OTg3NzQ3N30.4Qk-hH3NjawJX1eGQtzPnPOtwE9RieK42pjLxR0t65s";

  if (SUPABASE_URL === "YOUR_SUPABASE_URL") {
    console.warn("[AI APPs] supabase-client.js: falta configurar SUPABASE_URL y SUPABASE_ANON_KEY.");
    return;
  }

  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
