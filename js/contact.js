const contactLinks = document.querySelectorAll('.contact__link');
const contactCount = contactLinks.length;
const contactSection = document.querySelector('.contact');
if (!contactSection || !contactCount) return;

const SCROLL_PER_ITEM = 120;
const totalScroll = contactCount * SCROLL_PER_ITEM;

// Wrapper needed for sticky scroll
const wrapper = document.createElement('div');
wrapper.style.cssText = `height: ${totalScroll}px; position: relative;`;
contactSection.parentNode.insertBefore(wrapper, contactSection);
wrapper.appendChild(contactSection);

contactSection.style.cssText += 'position: sticky; top: 0;';

function update() {
  const wrapRect = wrapper.getBoundingClientRect();
  const scrolled = -wrapRect.top;
  const progress = Math.max(0, Math.min(1, scrolled / (totalScroll - window.innerHeight / 2)));
  const idx = Math.min(Math.floor(progress * contactCount), contactCount - 1);
  contactLinks.forEach((link, i) => {
    link.classList.toggle('is-active', i === idx);
  });
}

window.addEventListener('scroll', update, { passive: true });
update();
