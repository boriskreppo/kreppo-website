(() => {
  const ROTATION_DIVISOR = 14;
  const THRESHOLD_RATIO = 0.2;
  const FLY_DURATION = 380;
  const SNAP_DURATION = 320;
  const STACK_LIFT_PX = 72;
  const STACK_SCALE_STEP = 0.07;
  const BACK_BLUR_PX = 20;
  const BACK_TINT = 'rgba(255,255,255,0.3)';
  const STACK_MAX_VISIBLE = 3;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DATA = [
    { asset: 1, quote: 'Working with this studio completely transformed the way we think about digital products and user experience.', body: 'From the initial strategy sessions to the final polished interface, every step of the process felt thoughtful, collaborative, and incredibly well executed. Their team combines strong visual design with deep product thinking, helping us simplify complex ideas into an intuitive experience our users genuinely love.', name: 'Luka Kadic' },
    { asset: 2, quote: 'Working with this studio completely transformed the way we think about digital products and user experience.', body: 'From the initial strategy sessions to the final polished interface, every step of the process felt thoughtful, collaborative, and incredibly well executed. Their team combines strong visual design with deep product thinking, helping us simplify complex ideas into an intuitive experience our users genuinely love.', name: 'Ognjen' },
    { asset: 3, quote: 'Working with this studio completely transformed the way we think about digital products and user experience.', body: 'From the initial strategy sessions to the final polished interface, every step of the process felt thoughtful, collaborative, and incredibly well executed. Their team combines strong visual design with deep product thinking, helping us simplify complex ideas into an intuitive experience our users genuinely love.', name: 'Dunja' },
  ];

  const stackEl = document.getElementById('testimonials-stack');
  if (!stackEl) return;

  const dots = document.querySelectorAll('.testimonials__dot');
  let order = [];
  let totalCards = DATA.length;

  function updateDots() {
    const swiped = totalCards - order.length;
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === swiped);
    });
  }

  function buildCard(item) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="card__fill"></div>
      <div class="card__content">
        <div class="card__head">
          <div class="card__avatar"><img src="Assets/card ${item.asset} avatar.svg" alt="${item.name}"></div>
          <div class="card__el"><img src="Assets/card ${item.asset} element.svg" alt=""></div>
        </div>
        <p class="card__quote">${item.quote}</p>
        <p class="card__body">${item.body}</p>
        <p class="card__name">${item.name}</p>
      </div>`;
    return el;
  }

  // Get the resting transform for card at position i
  function restTransform(i) {
    if (i === 0) return { lift: 0, scale: 1 };
    return { lift: i * STACK_LIFT_PX, scale: 1 - i * STACK_SCALE_STEP };
  }

  function layout() {
    const tCard = reducedMotion ? 'transform .1s linear' : 'transform .3s ease';
    const tFill = reducedMotion ? 'background .1s linear'
      : 'background .3s ease, backdrop-filter .3s ease, -webkit-backdrop-filter .3s ease';

    order.forEach((card, i) => {
      card.style.zIndex = order.length - i;
      card.style.transition = tCard;
      card.style.opacity = 1;

      const fill = card.querySelector('.card__fill');
      fill.style.transition = tFill;

      if (i > STACK_MAX_VISIBLE - 1) { card.style.display = 'none'; return; }
      card.style.display = '';

      if (i === 0) {
        fill.style.background = 'var(--color-white)';
        fill.style.backdropFilter = 'none';
        fill.style.webkitBackdropFilter = 'none';
        card.style.transform = 'translateY(0) scale(1)';
      } else {
        fill.style.background = BACK_TINT;
        fill.style.backdropFilter = `blur(${BACK_BLUR_PX}px)`;
        fill.style.webkitBackdropFilter = `blur(${BACK_BLUR_PX}px)`;
        const { lift, scale } = restTransform(i);
        card.style.transform = `translateY(-${lift}px) scale(${scale})`;
      }
    });

    updateDots();
  }

  function renderInitial() {
    stackEl.innerHTML = '';
    order = DATA.map(buildCard);
    order.forEach(c => stackEl.appendChild(c));
    layout();
  }

  // Drag logic
  let dragging = false, intentResolved = false, startX = 0, startY = 0, dx = 0, dy = 0, cardWidth = 0, activePointerId = null;
  const INTENT_THRESHOLD = 6;

  function topCard() { return order[0]; }

  stackEl.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.card');
    if (!card || card !== topCard()) return;
    dragging = true;
    intentResolved = false;
    activePointerId = e.pointerId;
    cardWidth = card.offsetWidth;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0; dy = 0;
    card.classList.add('dragging');
  });

  stackEl.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== activePointerId) return;
    const movX = e.clientX - startX;
    const movY = e.clientY - startY;

    if (!intentResolved) {
      if (Math.abs(movX) < INTENT_THRESHOLD && Math.abs(movY) < INTENT_THRESHOLD) return;
      if (Math.abs(movY) > Math.abs(movX)) {
        dragging = false;
        intentResolved = false;
        topCard().classList.remove('dragging');
        return;
      }
      intentResolved = true;
      topCard().setPointerCapture(e.pointerId);
      // Kill transitions on all cards for instant response
      order.forEach(c => { c.style.transition = 'none'; });
    }

    dx = movX;
    dy = movY;

    // How far through the threshold (0 → 1)
    const dragProgress = Math.min(Math.abs(dx) / (cardWidth * THRESHOLD_RATIO), 1);

    order.forEach((card, i) => {
      if (i > STACK_MAX_VISIBLE - 1) return;

      if (i === 0) {
        // Front card follows finger
        const rotate = reducedMotion ? 0 : dx / ROTATION_DIVISOR;
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
      } else {
        // Each back card moves one step forward proportionally
        // Position i lerps toward position i-1
        const from = restTransform(i);
        const to = restTransform(i - 1);
        const lift = from.lift + (to.lift - from.lift) * dragProgress;
        const scale = from.scale + (to.scale - from.scale) * dragProgress;
        card.style.transform = `translateY(-${lift}px) scale(${scale})`;
      }
    });
  });

  function endDrag(e) {
    if (!dragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
    dragging = false;
    const card = topCard();
    card.classList.remove('dragging');
    try { card.releasePointerCapture(activePointerId); } catch (_) { }

    if (intentResolved) {
      const threshold = cardWidth * THRESHOLD_RATIO;
      if (Math.abs(dx) > threshold) {
        release(card, dx > 0 ? 1 : -1);
      } else {
        snapBack();
      }
    }
    dx = 0; dy = 0; activePointerId = null; intentResolved = false;
  }

  stackEl.addEventListener('pointerup', endDrag);
  stackEl.addEventListener('pointercancel', endDrag);
  stackEl.addEventListener('pointerleave', (e) => { if (dragging) endDrag(e); });

  function snapBack() {
    // Smoothly return ALL visible cards to their resting positions
    const transition = reducedMotion ? 'transform .1s linear' : `transform ${SNAP_DURATION}ms cubic-bezier(.2,.8,.2,1)`;
    order.forEach((card, i) => {
      if (i > STACK_MAX_VISIBLE - 1) return;
      card.style.transition = transition;
      const { lift, scale } = restTransform(i);
      if (i === 0) {
        card.style.transform = 'translate(0,0) rotate(0deg)';
      } else {
        card.style.transform = `translateY(-${lift}px) scale(${scale})`;
      }
    });
  }

  function release(card, direction) {
    const flyX = direction * window.innerWidth;
    const flyY = dy * 1.4;
    const rotate = reducedMotion ? 0 : direction * 24;

    // Animate front card off screen
    card.style.transition = reducedMotion
      ? 'transform .15s linear, opacity .15s linear'
      : `transform ${FLY_DURATION}ms ease-out, opacity ${FLY_DURATION}ms ease-out`;
    card.style.transform = `translate(${flyX}px, ${flyY}px) rotate(${rotate}deg)`;
    card.style.opacity = 0;

    // Simultaneously animate back cards to their new positions
    const transition = reducedMotion ? 'transform .15s linear' : `transform ${FLY_DURATION}ms ease-out`;
    order.forEach((c, i) => {
      if (i === 0 || i > STACK_MAX_VISIBLE - 1) return;
      c.style.transition = transition;
      const { lift, scale } = restTransform(i - 1);
      if (i - 1 === 0) {
        c.style.transform = 'translateY(0) scale(1)';
        const fill = c.querySelector('.card__fill');
        fill.style.background = 'var(--color-white)';
        fill.style.backdropFilter = 'none';
        fill.style.webkitBackdropFilter = 'none';
      } else {
        c.style.transform = `translateY(-${lift}px) scale(${scale})`;
      }
    });

    card.addEventListener('transitionend', function onEnd(evt) {
      if (evt.propertyName !== 'transform') return;
      card.removeEventListener('transitionend', onEnd);

      order.shift();
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = 1;
      order.push(card);
      stackEl.appendChild(card);

      layout();
    });
  }

  renderInitial();
})();
