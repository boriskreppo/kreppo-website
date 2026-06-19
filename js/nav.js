(() => {
  const btn = document.getElementById('menu-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('is-open');
  });

  // Close when a nav link is clicked
  btn.querySelectorAll('.menu-btn__link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
    });
  });
})();
