gsap.registerPlugin(ScrollTrigger);

const contactLinks = document.querySelectorAll('.contact__link');
const contactCount = contactLinks.length;

ScrollTrigger.create({
  trigger: '.contact',
  pin: true,
  pinSpacing: false,
  start: 'center center',
  end: '+=' + (contactCount * 40),
  snap: {
    snapTo: 1 / (contactCount - 1),
    duration: 0.3,
    ease: 'power1.inOut'
  },
  onUpdate: (self) => {
    const idx = Math.min(
      Math.floor(self.progress * contactCount),
      contactCount - 1
    );
    contactLinks.forEach((link, i) => {
      link.classList.toggle('is-active', i === idx);
    });
  }
});
