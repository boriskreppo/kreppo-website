(() => {
  const svg = document.querySelector('.intro__svg');
  if (!svg) return;

  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      // Rotate full 360° across scroll range
      const rotation = self.progress * 360;
      svg.style.transform = `rotate(${rotation}deg)`;
    }
  });
})();
