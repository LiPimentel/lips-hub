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
          height:32px;
          opacity:0;
          animation:coin-fall var(--dur,7s) linear infinite;
          animation-delay:var(--delay,0s);
          animation-fill-mode:backwards;
          pointer-events:none;
          filter:drop-shadow(0 3px 5px rgba(0,0,0,0.45));
        }
        .coin-rain svg{ width:100%; height:100%; display:block; overflow:visible; }
        /* Caen de punta a punta de la pantalla; el scaleX simula el giro de
           la moneda sobre su eje (de cara a canto y de vuelta). */
        @keyframes coin-fall{
          0%{ transform:translateY(0) rotate(-6deg) scaleX(1); opacity:0; }
          6%{ opacity:1; }
          25%{ transform:translateY(30vh) rotate(4deg) scaleX(0.12); }
          50%{ transform:translateY(60vh) rotate(-5deg) scaleX(-1); }
          75%{ transform:translateY(90vh) rotate(6deg) scaleX(0.12); }
          94%{ opacity:1; }
          100%{ transform:translateY(118vh) rotate(-4deg) scaleX(1); opacity:0; }
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
        .gantt-bar.c-brass{ background:linear-gradient(90deg, #B8863B, #D8AE6E); }
        .gantt-bar.c-teal{ background:linear-gradient(90deg, #3E6E6E, #7ecfc0); }
        .gantt-dot{
          position:absolute; top:50%; width:9px; height:9px; border-radius:50%;
          margin:-4.5px 0 0 -4.5px;
          box-shadow:0 0 6px 1px rgba(255,255,255,0.5);
          opacity:0;
          animation:gantt-dot-move 6s ease-in-out infinite;
        }
        .gantt-dot.c-brass{ background:#F3D9A8; }
        .gantt-dot.c-teal{ background:#bdf0e4; }
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
          filter:blur(2px); opacity:0.6; pointer-events:none;
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
        .growth-scene{
          position:absolute; left:3%; top:9%; width:min(72%,420px); height:82%;
          pointer-events:none;
        }
        .growth-path{
          position:absolute; inset:0; width:100%; height:100%; overflow:visible;
        }
        .growth-line{
          fill:none;
          stroke:rgba(255,255,255,0.38);
          stroke-width:1.8;
          stroke-dasharray:3.4 3.4;
        }
        .milestone{
          fill:#7ecfc0;
          opacity:0;
          animation:milestone-light 7s ease-in-out infinite;
        }
        .milestone.m1{ animation-delay:0s; }
        .milestone.m2{ animation-delay:0.98s; }
        .milestone.m3{ animation-delay:1.96s; }
        .milestone.m4{ animation-delay:2.94s; }
        @keyframes milestone-light{
          0%, 6%{ opacity:0; r:2.8; }
          14%, 80%{ opacity:1; r:3.4; }
          92%, 100%{ opacity:0; r:2.8; }
        }
        .growth-flag{
          position:absolute; width:30px; height:30px;
          transform-origin:22% 86%;
          animation:flag-cycle 7s ease-in-out infinite, flag-flutter 0.9s ease-in-out infinite;
        }
        .growth-flag svg{ width:100%; height:100%; fill:none; stroke:#D8AE6E; stroke-width:1.4; stroke-linecap:round; stroke-linejoin:round; }
        @keyframes flag-cycle{
          0%, 60%{ opacity:0; scale:0.55; translate:0 6px; }
          67%{ opacity:0.95; scale:1.05; translate:0 -1px; }
          74%, 100%{ opacity:0.95; scale:1; translate:0 0; }
        }
        @keyframes flag-flutter{
          0%, 100%{ rotate:-10deg; }
          50%{ rotate:-17deg; }
        }
        .hop-figure{
          position:absolute; width:21px; height:28px;
          margin:-28px 0 0 -10.5px;
          animation:hop-move 7s ease-in-out infinite, hop-squash 7s ease-in-out infinite;
        }
        .hop-figure svg{ width:100%; height:100%; }
        @keyframes hop-move{
          0%, 12%{ opacity:0; left:8%; top:92%; }
          14%, 19%{ opacity:1; left:8%; top:90%; }
          23%{ left:18%; top:70%; }
          27%, 33%{ left:28%; top:58%; }
          37%{ left:37%; top:38%; }
          41%, 47%{ left:46%; top:26%; }
          51%{ left:60%; top:14%; }
          55%, 59%{ left:74%; top:8%; }
          60%, 100%{ opacity:0; left:74%; top:8%; }
        }
        @keyframes hop-squash{
          0%, 12%{ scale:0.5; }
          14%{ scale:0.85 1.15; }
          17%, 19%{ scale:1; }
          23%{ scale:1.1 0.9; }
          27%{ scale:0.85 1.15; }
          30%, 33%{ scale:1; }
          37%{ scale:1.1 0.9; }
          41%{ scale:0.85 1.15; }
          44%, 47%{ scale:1; }
          51%{ scale:1.1 0.9; }
          55%{ scale:0.85 1.2; }
          59%{ scale:1; }
          60%, 100%{ scale:0.5; }
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
        .interview-icon:hover{
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
          const fallingCoin = `<svg viewBox="0 0 26 32" aria-hidden="true">
            <ellipse cx="13" cy="15.5" rx="12" ry="9" fill="#4a3208"/>
            <rect x="1" y="11" width="24" height="4.5" fill="url(#coinEdgeGrad)"/>
            <rect x="1" y="11" width="24" height="4.5" fill="url(#coinEdgeShade)"/>
            <ellipse cx="13" cy="11" rx="12" ry="9" fill="url(#coinGrad)" stroke="#5c4009" stroke-width="0.8"/>
            <ellipse cx="13" cy="11" rx="8" ry="6" fill="none" stroke="rgba(122,84,10,0.5)" stroke-width="0.7"/>
            <ellipse cx="10" cy="8" rx="4.5" ry="2.6" fill="rgba(255,255,255,0.5)"/>
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
            return `<span class="coin-rain" style="left:${left}%; --dur:${duration}s; --delay:${delay}s;">${fallingCoin}${sparkle}</span>`;
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
          const rows = Array.from({ length: 9 }).map((_, i) => {
            const w = (48 + Math.random() * 42).toFixed(0);
            const delay = (i * 0.68).toFixed(2);
            const day = Math.floor(Math.random() * 28) + 1;
            const cls = i % 2 === 0 ? 'c-brass' : 'c-teal';
            const flagColor = flagColors[i % flagColors.length];
            return `<div class="gantt-row">
                <div class="gantt-bar ${cls}" style="--w:${w}%; animation-delay:${delay}s;"></div>
                <span class="gantt-dot ${cls}" style="--w:${w}%; animation-delay:${delay}s;"></span>
                <span class="gantt-date" style="left:${w}%; animation-delay:${delay}s;">${day}</span>
                <span class="gantt-flag" style="left:${w}%; animation-delay:${delay}s;"><svg viewBox="0 0 24 24" style="stroke:${flagColor}"><path d="M5 21V4"/><path d="M5 4.5h13l-3 4 3 4H5"/></svg></span>
              </div>`;
          }).join('');
          return `<div class="gantt-scene">${rows}</div>`;
        })() : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'travel-sky' ? `
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
              <g fill="#08121c">
                <path d="M0 140 L0 105 L20 105 L20 88 L36 88 L36 105 L52 105 L52 70 L70 70 L70 105 L88 105 L88 95 L106 95 L106 105 L124 105 L124 80 L142 80 L142 105 L160 105 L160 92 L178 92 L178 105 L400 105 L400 140Z"/>
              </g>
              <g fill="#F4C060">
                <circle cx="24" cy="94" r="1.1"/><circle cx="30" cy="94" r="1.1"/><circle cx="24" cy="99" r="1.1"/><circle cx="30" cy="99" r="1.1"/>
                <circle cx="58" cy="78" r="1.1"/><circle cx="64" cy="78" r="1.1"/><circle cx="58" cy="84" r="1.1"/><circle cx="64" cy="84" r="1.1"/><circle cx="58" cy="90" r="1.1"/><circle cx="64" cy="90" r="1.1"/><circle cx="58" cy="96" r="1.1"/><circle cx="64" cy="96" r="1.1"/>
                <circle cx="76" cy="99" r="1.1"/><circle cx="82" cy="99" r="1.1"/>
                <circle cx="110" cy="99" r="1.1"/><circle cx="116" cy="99" r="1.1"/>
                <circle cx="128" cy="84" r="1.1"/><circle cx="134" cy="84" r="1.1"/><circle cx="128" cy="90" r="1.1"/><circle cx="134" cy="90" r="1.1"/><circle cx="128" cy="96" r="1.1"/><circle cx="134" cy="96" r="1.1"/>
                <circle cx="164" cy="96" r="1.1"/><circle cx="170" cy="96" r="1.1"/>
              </g>
            </svg>
          </div>
          ${(() => {
            const planeIcon = '<path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/>';
            const planes = [
              { anim: 'fly-1', dur: 15, delay: 0, layer: 'plane-behind' },
              { anim: 'fly-2', dur: 18, delay: 3, layer: 'plane-front' },
              { anim: 'fly-3', dur: 13, delay: 7, layer: 'plane-front' },
              { anim: 'fly-4', dur: 20, delay: 1, layer: 'plane-behind' },
              { anim: 'fly-5', dur: 17, delay: 5, layer: 'plane-front' },
              { anim: 'fly-6', dur: 22, delay: 9, layer: 'plane-front' }
            ];
            return planes.map(p => `<span class="plane ${p.layer}" style="animation:${p.anim} ${p.dur}s linear infinite; animation-delay:${p.delay}s;"><svg viewBox="0 0 24 24">${planeIcon}</svg></span>`).join('');
          })()}
          ${(() => {
            const cloudSvg = '<svg viewBox="0 0 40 20"><ellipse cx="16" cy="12" rx="15" ry="7" fill="#e8f4f2"/><ellipse cx="26" cy="9" rx="10" ry="6" fill="#e8f4f2"/></svg>';
            const clouds = [
              { left: 8, top: 8, w: 34, h: 16, dur: 22, delay: 0, op: 0.55 },
              { left: 45, top: 5, w: 26, h: 13, dur: 18, delay: -3, op: 0.4 },
              { left: 68, top: 14, w: 40, h: 19, dur: 26, delay: -9, op: 0.55 },
              { left: 20, top: 24, w: 22, h: 11, dur: 16, delay: -6, op: 0.35 }
            ];
            return clouds.map(c => `<span class="cloud-el" style="left:${c.left}%; top:${c.top}%; width:${c.w}px; height:${c.h}px; animation-duration:${c.dur}s; animation-delay:${c.delay}s; opacity:${c.op};">${cloudSvg}</span>`).join('');
          })()}
        ` : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'mentor-people' ? `
          <div class="growth-scene">
            <svg class="growth-path" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path class="growth-line" d="M3 96 C 20 82, 14 60, 34 50 C 54 40, 44 18, 80 4" vector-effect="non-scaling-stroke"/>
              <circle class="milestone m1" cx="8" cy="90"/>
              <circle class="milestone m2" cx="28" cy="58"/>
              <circle class="milestone m3" cx="46" cy="26"/>
              <circle class="milestone m4" cx="74" cy="8"/>
            </svg>
            <div class="growth-flag" style="left:70%; top:-8%;">
              <svg viewBox="0 0 24 24"><path d="M5 21V4"/><path d="M5 4.5h13l-3 4 3 4H5"/></svg>
            </div>
            <div class="hop-figure">
              <svg viewBox="0 0 24 32">
                <path d="M12 2.5 C16 2.5 16.6 6 15.4 9.4 C19.2 11.2 19.6 17 18 21.2 C16.8 26.6 14.2 29.5 12 29.5 C9.8 29.5 7.2 26.6 6 21.2 C4.4 17 4.8 11.2 8.6 9.4 C7.4 6 8 2.5 12 2.5 Z" fill="#fff9e6"/>
                <ellipse cx="10.2" cy="5.6" rx="1.3" ry="0.9" fill="rgba(255,255,255,0.55)"/>
              </svg>
            </div>
          </div>
        ` : ''}
        ${window.AIAPPS_LOGIN_SCENE === 'interview' ? (() => {
          const names = ['clipboard', 'magnifier', 'briefcase', 'chat-bubble', 'target', 'gear', 'graduation-cap', 'pencil', 'compass', 'trending-up', 'book', 'lightbulb', 'people', 'star', 'calendar', 'clock', 'bar-chart', 'flag'];
          const colors = ['#E03B2E', '#D8AE6E', '#4E8B8B', '#8C6BAE', '#E8935C', '#5C9BD8', '#7ecfc0'];
          const cols = [3, 12, 21, 79, 88, 97];
          const rows = [4, 14, 24, 76, 86, 96];
          const cells = [];
          rows.forEach(top => cols.forEach(left => cells.push({ top, left })));
          return cells.map((cell, i) => {
            const name = names[i % names.length];
            const svgPath = ICONS[name];
            if (!svgPath) return '';
            const color = colors[i % colors.length];
            const jitterTop = (Math.random() - 0.5) * 10;
            const jitterLeft = (Math.random() - 0.5) * 7;
            const size = 1.7 + Math.random() * 1.0;
            const pos = `top:${(cell.top + jitterTop).toFixed(1)}%; left:${(cell.left + jitterLeft).toFixed(1)}%; width:${size.toFixed(2)}rem; height:${size.toFixed(2)}rem;`;
            const delay = (i % 14) * 0.14 + Math.random() * 0.3;
            return `<span class="interview-icon" style="${pos}"><span class="interview-icon-float" style="animation-delay:-${delay.toFixed(2)}s"><svg viewBox="0 0 24 24" style="stroke:${color}">${svgPath}</svg></span></span>`;
          }).join('');
        })() : ''}
        ${!window.AIAPPS_LOGIN_SCENE ? (window.AIAPPS_LOGIN_DECORATIONS || []).map((iconName, i) => {
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
        }).join('') : ''}
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
