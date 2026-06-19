(() => {
  const petals = ['s2-p0', 's2-p1', 's2-p2', 's2-p3'];
  const LIME = '#E2F271';
  const BLACK = '#000000';
  // Start order: left(3), top(0), right(1), bottom(2) — clockwise from 9 o'clock
  const order = [3, 0, 1, 2];
  let current = 0; // index into order array

  function setActive(idx) {
    if (idx === current) return;
    petals.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('fill', i === order[idx] ? LIME : BLACK);
    });
    current = idx;
  }

  // Initialize — start with petal 3 (left)
  petals.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('fill', i === 3 ? LIME : BLACK);
  });

  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const idx = Math.min(
        Math.floor(self.progress * order.length),
        order.length - 1
      );
      setActive(idx);
    }
  });
})();
