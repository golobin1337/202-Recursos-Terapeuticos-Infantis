// ===== CÓDIGO-FONTE LEGÍVEL =====
// Não é publicado no site (a pasta _src está no .vercelignore).
// Depois de editar este arquivo, rode _src/build.ps1 para gerar o script.js ofuscado que o site usa.

// --- Proteção anticlonagem (não interfere em rolagem, cliques ou toques) ---
(()=>{
const editable=t=>t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
// menu do botão direito
document.addEventListener('contextmenu',e=>{if(!editable(e.target))e.preventDefault();});
// atalhos: Ctrl/Cmd+U, Ctrl/Cmd+S, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C, F12
document.addEventListener('keydown',e=>{
const k=(e.key||'').toLowerCase(),mod=e.ctrlKey||e.metaKey;
if(e.key==='F12'||(mod&&(k==='u'||k==='s'))||(mod&&(e.shiftKey||e.altKey)&&(k==='i'||k==='j'||k==='c'))){e.preventDefault();e.stopPropagation();}
},true);
// copiar (fora de campos de formulário) e arrastar imagens
document.addEventListener('copy',e=>{if(!editable(e.target))e.preventDefault();});
document.addEventListener('dragstart',e=>{if(e.target&&e.target.tagName==='IMG')e.preventDefault();});
})();

document.addEventListener('DOMContentLoaded',()=>{
// --- Imagens carregadas pelo script (data-src -> src); o lazy loading nativo continua valendo ---
document.querySelectorAll('img[data-src]').forEach(i=>{if(i.dataset.srcset)i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute('data-src');i.removeAttribute('data-srcset');});

document.getElementById('year').textContent=new Date().getFullYear();
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.15});
reveals.forEach(el=>{const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));el.style.transitionDelay=sib.indexOf(el)*90+'ms';io.observe(el);});
}else reveals.forEach(el=>el.classList.add('visible'));
const counter=document.querySelector('.count');
if(counter&&!reduceMotion){
const target=+counter.dataset.target,start=performance.now();
const tick=now=>{const p=Math.min((now-start)/1400,1);counter.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);};
requestAnimationFrame(tick);
}
document.querySelectorAll('.marquee').forEach(mq=>{
const track=mq.querySelector('.marquee-track'),originals=[...track.children];
const addCopy=items=>items.forEach(it=>{const c=it.cloneNode(true);c.setAttribute('aria-hidden','true');track.appendChild(c);});
while(track.scrollWidth<mq.clientWidth)addCopy(originals);
addCopy([...track.children]);
const speed=+mq.dataset.speed||40;
const setDur=()=>track.style.setProperty('--marquee-dur',track.scrollWidth/2/speed+'s');
setDur();addEventListener('resize',setDur);
let t;
mq.addEventListener('touchstart',()=>{mq.classList.add('paused');clearTimeout(t);},{passive:true});
mq.addEventListener('touchend',()=>{t=setTimeout(()=>mq.classList.remove('paused'),1500);},{passive:true});
});
// barra fixa: aparece depois que o botão do plano completo sai pelo topo da tela; some se a pessoa voltar acima dele
const bar=document.getElementById('stickyBuy'),anchor=document.querySelector('.plan-full .btn-cta');
if(bar&&anchor){
let ticking=false;
const upd=()=>{ticking=false;bar.classList.toggle('show',anchor.getBoundingClientRect().bottom<0);};
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});
upd();
}
// popup de oferta: abre pelo onclick do botão do plano básico (em todo clique); aqui só os jeitos de fechar
const ds=document.getElementById('downsell');
if(ds&&ds.showModal){
ds.querySelector('.ds-close').addEventListener('click',()=>ds.close());
ds.addEventListener('click',e=>{if(e.target===ds)ds.close();});
}
document.querySelectorAll('.faq-item').forEach(item=>{
const btn=item.querySelector('.faq-q'),ans=item.querySelector('.faq-a');
btn.addEventListener('click',()=>{
const open=item.classList.contains('open');
document.querySelectorAll('.faq-item.open').forEach(o=>{o.classList.remove('open');o.querySelector('.faq-q').setAttribute('aria-expanded','false');o.querySelector('.faq-a').style.maxHeight=null;});
if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');ans.style.maxHeight=ans.scrollHeight+'px';}
});
});
});
