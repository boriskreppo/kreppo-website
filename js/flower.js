(() => {
  const petals = document.querySelector('.intro__svg g[clip-path="url(#s2c2)"]');
  if (!petals) return;

  // 4 latica su oko centra ~(127, 112) u SVG koordinatama
  // SVG je 192x170, pa je origin u sredini cveća
  const originX = '50%';
  const originY = '50%';

  petals.style.transformOrigin = `${originX} ${originY}`;

  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const rotation = self.progress * 360;
      petals.style.transform = `rotate(${rotation}deg)`;
    }
  });
})();
