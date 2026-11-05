const root = document.querySelector<HTMLElement>('[data-tours]')!;
const dialog = document.getElementById('tour-dialog') as HTMLDialogElement;

// Filtros por duración
const buttons = root.querySelectorAll<HTMLButtonElement>('[data-filter]');
const cards = root.querySelectorAll<HTMLElement>('.tour-card');
buttons.forEach((b) =>
  b.addEventListener('click', () => {
    const k = b.dataset.filter;
    buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    cards.forEach((c) => { c.hidden = !(k === 'all' || c.dataset.kind === k); });
  }),
);

// Modal accesible: <dialog> nativo = foco atrapado, Esc y fondo inerte
cards.forEach((c) =>
  c.addEventListener('click', () => {
    const tpl = document.getElementById(`tpl-${c.dataset.tour}`) as HTMLElement | null;
    if (!tpl) return;
    const box = tpl.firstElementChild!.cloneNode(true) as HTMLElement;
    box.querySelector('h3')!.id = 'tour-dialog-title';
    dialog.replaceChildren(box);
    document.body.classList.add('lock');
    dialog.showModal();
    dialog.scrollTop = 0;
  }),
);
dialog.addEventListener('click', (e) => {
  const el = e.target as HTMLElement;
  if (el === dialog || el.closest('[data-close]')) dialog.close(); // clic fuera o en la X
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('lock');
  dialog.replaceChildren();
});
