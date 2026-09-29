// ========= Configuração =========
// Cole aqui os links do seu checkout (Hotmart, Kiwify, Eduzz etc.)
const CHECKOUT_URLS = {
  completo: 'https://mundoconhecimento.mycartpanda.com/checkout/182650613:1', // plano de R$ 27,90
  basico: 'https://mundoconhecimento.mycartpanda.com/checkout/181538414:1', // plano de R$ 14,90
};

document.addEventListener('DOMContentLoaded', () => {
  // Links do checkout
  document.querySelectorAll('.checkout-link').forEach((a) => {
    a.href = CHECKOUT_URLS[a.dataset.plan] || '#';
  });

  // Ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // Animação de entrada ao rolar
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach((el) => {
      // pequeno atraso escalonado entre itens irmãos
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // Contador do número 202 no hero
  const counter = document.querySelector('.count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counter && !reduceMotion) {
    const target = Number(counter.dataset.target);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      counter.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Carrosséis (depoimentos e prints): arrastar no celular/tablet + bolinhas + troca automática
  const initCarousel = (track, dotsBox) => {
    if (!track || !dotsBox) return;
    const slides = [...track.children];
    const base = () => slides[0].offsetLeft;
    const goTo = (i) => {
      track.scrollTo({ left: slides[i].offsetLeft - base(), behavior: 'smooth' });
    };
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(b);
      return b;
    });

    const isCarousel = () => getComputedStyle(dotsBox).display !== 'none';
    const current = () => {
      const left = track.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => {
        if (Math.abs(s.offsetLeft - base() - left) < Math.abs(slides[best].offsetLeft - base() - left)) best = i;
      });
      return best;
    };
    const updateDots = () => {
      const i = current();
      dots.forEach((d, j) => d.classList.toggle('active', j === i));
    };
    track.addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });
    updateDots();

    // troca automática a cada 4s; pausa por alguns segundos quando a pessoa toca/arrasta e depois continua
    let pauseUntil = 0;
    let hovering = false;
    const pause = () => { pauseUntil = Date.now() + 6000; };
    ['touchstart', 'pointerdown', 'wheel'].forEach((ev) =>
      track.addEventListener(ev, pause, { passive: true }));
    track.addEventListener('mouseenter', () => { hovering = true; });
    track.addEventListener('mouseleave', () => { hovering = false; });
    if (!reduceMotion) {
      setInterval(() => {
        if (hovering || Date.now() < pauseUntil || !isCarousel()) return;
        // chegou ao fim (várias imagens visíveis ao mesmo tempo)? volta para o início
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        goTo(atEnd ? 0 : (current() + 1) % slides.length);
      }, 4000);
    }
  };
  initCarousel(document.getElementById('printsCarousel'), document.getElementById('printsDots'));
  initCarousel(document.getElementById('pagesCarousel'), document.getElementById('pagesDots'));

  // FAQ acordeão
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
