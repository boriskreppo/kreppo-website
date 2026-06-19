(() => {
  const petals = document.querySelector('.intro__svg g[clip-path="url(#s2c2)"]');
  if (!petals) return;

  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      // Rotate cvet 360° across scroll range
      const rotation = self.progress * 360;
      petals.style.transform = `rotate(${rotation}deg)`;
      petals.style.transformOrigin = 'center';
    }
  });
})();
