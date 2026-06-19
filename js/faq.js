(() => {
  document.querySelectorAll('.faq__item-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq__item');
      const wasOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));

      // Toggle clicked
      if (!wasOpen) item.classList.add('is-open');
    });
  });
})();
