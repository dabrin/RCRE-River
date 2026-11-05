const root = document.querySelector<HTMLElement>('[data-gallery]')!;
const dlg = document.getElementById('lightbox') as HTMLDialogElement;
const stage = dlg.querySelector<HTMLElement>('[data-stage]')!;
const cap = dlg.querySelector<HTMLElement>('[data-cap]')!;
const items = [...root.querySelectorAll<HTMLButtonElement>('[data-lb]')];
let idx = 0;

function render() {
  const b = items[idx];
  const alt = b.dataset.alt ?? '';
  stage.replaceChildren();
  let el: HTMLElement;
  if (b.dataset.type === 'video') {
    if (b.dataset.youtube) {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.youtube}?autoplay=1&rel=0`;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.title = alt;
      el = f;
    } else {
      const v = document.createElement('video');
      v.src = b.dataset.src!;
      v.controls = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('aria-label', alt);
      el = v;
    }
  } else {
    const i = document.createElement('img');
    i.src = b.dataset.full!;
    i.alt = alt;
    el = i;
  }
  stage.append(el);
  cap.textContent = `${alt} · ${idx + 1} ${dlg.dataset.of} ${items.length}`;
}
const go = (d: number) => { idx = (idx + d + items.length) % items.length; render(); };

items.forEach((b, i) => b.addEventListener('click', () => {
  idx = i; render(); document.body.classList.add('lock'); dlg.showModal();
}));
dlg.querySelector('[data-lb-prev]')!.addEventListener('click', () => go(-1));
dlg.querySelector('[data-lb-next]')!.addEventListener('click', () => go(1));
dlg.querySelector('[data-lb-close]')!.addEventListener('click', () => dlg.close());
// Clic en el fondo (no sobre la imagen) cierra
stage.addEventListener('click', (e) => { if (e.target === stage) dlg.close(); });
dlg.addEventListener('close', () => { stage.replaceChildren(); document.body.classList.remove('lock'); });
dlg.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
});
// Gestos de deslizar
let x0: number | null = null, y0 = 0;
stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
stage.addEventListener('pointerup', (e) => {
  if (x0 === null) return;
  const dx = e.clientX - x0, dy = e.clientY - y0;
  x0 = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
});
stage.addEventListener('pointercancel', () => { x0 = null; });
