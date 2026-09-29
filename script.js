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

  // Carrossel infinito: duplica os itens e rola sem parar (pausa ao passar o mouse ou tocar)
  document.querySelectorAll('.marquee').forEach((marquee) => {
    const track = marquee.querySelector('.marquee-track');
    const originals = [...track.children];
    const addCopy = (items) => items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    // repete os itens até preencherem a largura da tela, e depois duplica tudo para o loop ficar contínuo
    while (track.scrollWidth < marquee.clientWidth) addCopy(originals);
    addCopy([...track.children]);

    // velocidade constante em px/s, independente da quantidade de imagens
    const speed = Number(marquee.dataset.speed) || 40;
    const setDuration = () => {
      track.style.setProperty('--marquee-dur', `${track.scrollWidth / 2 / speed}s`);
    };
    setDuration();
    window.addEventListener('load', setDuration);
    window.addEventListener('resize', setDuration);

    let resumeTimer;
    marquee.addEventListener('touchstart', () => {
      marquee.classList.add('paused');
      clearTimeout(resumeTimer);
    }, { passive: true });
    marquee.addEventListener('touchend', () => {
      resumeTimer = setTimeout(() => marquee.classList.remove('paused'), 1500);
    }, { passive: true });
  });

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
