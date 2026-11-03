// Lightweight canvas confetti. No third-party runtime dependency required.
export default function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(ratio, ratio);
  const colors = ['#f7a9bd', '#c8b8f4', '#ffc5a6', '#ffe28a', '#a9d9f2', '#ed7093'];
  const pieces = Array.from({ length: 125 }, () => ({
    x: Math.random() * window.innerWidth, y: -20 - Math.random() * window.innerHeight * .7,
    size: 4 + Math.random() * 6, speed: 2 + Math.random() * 4,
    drift: (Math.random() - .5) * 2.5, rotation: Math.random() * 6,
    spin: (Math.random() - .5) * .18, color: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach(p => {
      p.y += p.speed; p.x += p.drift; p.rotation += p.spin;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65);
      ctx.restore();
    });
    frame++;
    if (frame < 190) requestAnimationFrame(draw);
    else canvas.remove();
  };
  requestAnimationFrame(draw);
}