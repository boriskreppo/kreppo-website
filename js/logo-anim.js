document.addEventListener('DOMContentLoaded', () => {
  const dots = document.querySelectorAll('.topbar__dots span');
  if (dots.length !== 4) return;

  const originals = [
    { left: 0, top: 10 },
    { left: 16, top: 0 },
    { left: 6, top: 22 },
    { left: 22, top: 12 },
  ];

  const cx = 13;
  const cy = 10;
  const rx = 18;
  const ry = 7;
  const tilt = -0.5;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  function ellipsePos(angle) {
    const ex = Math.cos(angle) * rx;
    const ey = Math.sin(angle) * ry;
    return {
      x: cx + ex * cosT - ey * sinT,
      y: cy + ex * sinT + ey * cosT,
    };
  }

  // Calculate angle on ellipse matching each dot's original position
  function angleForDot(i) {
    const dx = originals[i].left - cx;
    const dy = originals[i].top - cy;
    const ux = dx * cosT + dy * sinT;
    const uy = -dx * sinT + dy * cosT;
    return Math.atan2(uy / ry, ux / rx);
  }

  const startAngles = originals.map((_, i) => angleForDot(i));

  // Start all dots at center
  dots.forEach((dot) => {
    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
  });

  const proxy = { radius: 0, angle: 0 };
  const totalAngle = Math.PI * 2 * 2; // 2 full rotations, ends back at start

  const tl = gsap.timeline({ delay: 1 });

  tl.to(proxy, {
    radius: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, 0);

  tl.to(proxy, {
    angle: totalAngle,
    duration: 4,
    ease: 'none',
    onUpdate: () => {
      dots.forEach((dot, i) => {
        const pos = ellipsePos(startAngles[i] + proxy.angle);
        const x = cx + (pos.x - cx) * proxy.radius;
        const y = cy + (pos.y - cy) * proxy.radius;
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
      });
    }
  }, 0);
});
