(() => {
  const petals = document.querySelector('.intro__svg g[clip-path="url(#s2c2)"]');
  if (!petals) return;

  // Latica su u clipPath x="85" y="85" width="85" height="85"
  // Center je 85 + 42.5 = 127.5, 85 + 42.5 = 127.5 (u SVG viewBox koordinatama)
  // ViewBox je 192x170, pa konvertujem u procente: (127.5/192)*100, (127.5/170)*100
  const originXPercent = (127.5 / 192) * 100;
  const originYPercent = (127.5 / 170) * 100;

  petals.setAttribute('transform-origin', `${originXPercent}% ${originYPercent}%`);
  petals.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;
  petals.style.transformBox = 'fill-box';

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
