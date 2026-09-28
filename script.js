// ========= Configuração =========
// Cole aqui os links do seu checkout (Hotmart, Kiwify, Eduzz etc.)
const CHECKOUT_URLS = {
  completo: '#', // plano de R$ 27,90
  basico: '#',   // plano de R$ 14,90
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

  // CTA fixo no mobile: aparece depois do hero e some na seção de oferta
  const sticky = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  const offer = document.getElementById('oferta');
  const updateSticky = () => {
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const r = offer.getBoundingClientRect();
    const onOffer = r.top < window.innerHeight && r.bottom > 0;
    sticky.classList.toggle('show', pastHero && !onOffer);
  };
  window.addEventListener('scroll', updateSticky, { passive: true });
  updateSticky();
});
