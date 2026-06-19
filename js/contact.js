gsap.registerPlugin(ScrollTrigger);

const contactLinks = document.querySelectorAll('.contact__link');
const contactCount = contactLinks.length;

let currentIdx = 0;

function setActive(idx) {
  currentIdx = Math.max(0, Math.min(idx, contactCount - 1));
  contactLinks.forEach((link, i) => {
    link.classList.toggle('is-active', i === currentIdx);
  });
}

setActive(0);

const contactSection = document.querySelector('.contact');
let pinStart = 0;

ScrollTrigger.create({
  trigger: '.contact',
  pin: true,
  start: 'top top',
  end: '+=80',
  onEnter: () => {
    pinStart = contactSection.getBoundingClientRect().top + window.scrollY;
  }
});

let wheelBuffer = 0;
const WHEEL_THRESHOLD = 80;

window.addEventListener('wheel', (e) => {
  const st = ScrollTrigger.getById('contact-pin') || ScrollTrigger.getAll().find(t => t.trigger === contactSection);
  if (!st || !st.isActive) { wheelBuffer = 0; return; }

  wheelBuffer += e.deltaY;

  if (wheelBuffer > WHEEL_THRESHOLD && currentIdx < contactCount - 1) {
    wheelBuffer = 0;
    setActive(currentIdx + 1);
  } else if (wheelBuffer < -WHEEL_THRESHOLD && currentIdx > 0) {
    wheelBuffer = 0;
    setActive(currentIdx - 1);
  }
}, { passive: true });
