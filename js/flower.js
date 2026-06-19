(() => {
  const petals = document.getElementById('flower-petals');
  if (!petals) return;

  // Set transform origin to center of petals (127.5, 127.5 in SVG coords)
  petals.style.transformOrigin = '127.5px 127.5px';

  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const rotation = self.progress * 540;
      petals.style.transform = `rotate(${rotation}deg)`;
    }
  });
})();
