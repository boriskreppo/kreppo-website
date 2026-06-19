gsap.registerPlugin(ScrollTrigger);

const contactLinks = document.querySelectorAll('.contact__link');
const contactCount = contactLinks.length;

ScrollTrigger.create({
  trigger: '.contact',
  pin: true,
  start: 'center center',
  end: '+=' + ((contactCount - 1) * 25),
  snap: {
    snapTo: 1 / (contactCount - 1),
    duration: 0.3,
    ease: 'power1.inOut'
  },
  onUpdate: (self) => {
    const idx = Math.round(self.progress * (contactCount - 1));
    contactLinks.forEach((link, i) => {
      link.classList.toggle('is-active', i === idx);
    });
  }
});
