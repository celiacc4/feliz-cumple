// Tarjeta de cumpleaños interactiva
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Confeti en canvas ---------- */
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#ff6fa5", "#8b5cf6", "#ffd166", "#06d6a0", "#4cc9f0", "#ffffff"];
  let pieces = [];
  let running = false;

  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  addEventListener("resize", resize);
  resize();

  function burst(count = 160) {
    if (reduced) return;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: innerHeight / 3,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 8 + 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        life: 0,
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.vy += 0.3; p.vx *= 0.99;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    pieces = pieces.filter(p => p.y < canvas.height + 40 && p.life < 400);
    if (pieces.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ---------- Globos que suben ---------- */
  const balloonBox = document.getElementById("balloons");
  const balloonEmojis = ["🎈", "🎈", "🎈", "💖", "🎀", "✨"];

  function launchBalloon() {
    const b = document.createElement("span");
    b.className = "balloon";
    b.textContent = balloonEmojis[(Math.random() * balloonEmojis.length) | 0];
    b.style.left = Math.random() * 100 + "vw";
    b.style.fontSize = 2 + Math.random() * 2.5 + "rem";
    b.style.setProperty("--drift", (Math.random() - 0.5) * 200 + "px");
    b.style.setProperty("--spin", (Math.random() - 0.5) * 60 + "deg");
    b.style.animationDuration = 8 + Math.random() * 6 + "s";
    b.addEventListener("animationend", () => b.remove());
    balloonBox.appendChild(b);
  }
  if (!reduced) {
    for (let i = 0; i < 5; i++) setTimeout(launchBalloon, i * 600);
    setInterval(launchBalloon, 1800);
  }

  /* ---------- Abrir / cerrar tarjeta ---------- */
  const card = document.getElementById("card");
  const hint = document.getElementById("hint");
  card.addEventListener("click", () => {
    const open = card.classList.toggle("open");
    card.setAttribute("aria-expanded", String(open));
    hint.textContent = open ? "Toca otra vez para cerrarla 💕" : "Toca la tarjeta para abrirla 💌";
    if (open) burst(200);
  });

  /* ---------- Soplar las velas ---------- */
  const cake = document.getElementById("cake");
  const blow = document.getElementById("blow");
  const wish = document.getElementById("wish");
  blow.addEventListener("click", () => {
    const out = cake.classList.toggle("out");
    wish.hidden = !out;
    blow.textContent = out ? "🕯️ Encender otra vez" : "🌬️ Sopla las velas";
    if (out) { burst(120); for (let i = 0; i < 6; i++) setTimeout(launchBalloon, i * 150); }
  });

  /* ---------- Botón de confeti ---------- */
  document.getElementById("party").addEventListener("click", () => burst(250));

  /* ---------- Stickers arrastrables ---------- */
  document.querySelectorAll(".sticker").forEach(st => {
    let dx = 0, dy = 0;
    st.addEventListener("pointerdown", e => {
      const r = st.getBoundingClientRect();
      dx = e.clientX - r.left; dy = e.clientY - r.top;
      st.classList.add("dragging");
      st.setPointerCapture(e.pointerId);
    });
    st.addEventListener("pointermove", e => {
      if (!st.classList.contains("dragging")) return;
      st.style.left = e.clientX - dx + "px";
      st.style.top = e.clientY - dy + "px";
      st.style.right = "auto"; st.style.bottom = "auto";
    });
    const drop = () => st.classList.remove("dragging");
    st.addEventListener("pointerup", drop);
    st.addEventListener("pointercancel", drop);
  });

  // Pequeña bienvenida
  setTimeout(() => burst(80), 600);
})();
