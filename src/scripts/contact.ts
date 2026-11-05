const form = document.querySelector<HTMLFormElement>('[data-form]')!;
const msgs = JSON.parse(form.dataset.msgs!) as Record<string, string>;
const key = form.dataset.key ?? '';
const to = form.dataset.email!;
const ok = form.querySelector<HTMLElement>('[data-ok]')!;
const err = form.querySelector<HTMLElement>('[data-err]')!;
const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
const fields = ['name', 'email', 'message'] as const;

function check(): boolean {
  let valid = true;
  for (const n of fields) {
    const el = form.elements.namedItem(n) as HTMLInputElement;
    const out = form.querySelector<HTMLElement>(`#${el.id}-e`)!;
    let m = '';
    if (!el.value.trim()) m = msgs.required;
    else if (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) m = msgs.invalidEmail;
    el.setAttribute('aria-invalid', m ? 'true' : 'false');
    out.textContent = m;
    if (m) valid = false;
  }
  return valid;
}
form.addEventListener('input', (e) => {
  const el = e.target as HTMLInputElement;
  if (el.getAttribute('aria-invalid') === 'true') check();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  ok.hidden = err.hidden = true;
  const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
  if (data.botcheck) return; // honeypot: probablemente un bot, se ignora en silencio
  if (!check()) {
    err.textContent = msgs.invalid; err.hidden = false;
    (form.querySelector('[aria-invalid=true]') as HTMLElement | null)?.focus();
    return;
  }
  const name = data.name.trim(), email = data.email.trim(), message = data.message.trim();

  // Sin clave configurada (desarrollo): se abre el correo del usuario como alternativa
  if (!key) {
    location.href = `mailto:${to}?subject=${encodeURIComponent('Web: ' + name)}&body=${encodeURIComponent(message + '\n\n' + name + ' — ' + email)}`;
    ok.textContent = msgs.sentMailto; ok.hidden = false;
    return;
  }

  btn.disabled = true; btn.textContent = msgs.sending;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `Web: ${name}`,
        from_name: name,
        name, email, message,
        botcheck: '',
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false) throw new Error(j.message || r.statusText);
    form.reset();
    fields.forEach((n) => (form.elements.namedItem(n) as HTMLElement).removeAttribute('aria-invalid'));
    ok.textContent = msgs.sent; ok.hidden = false;
  } catch {
    err.textContent = msgs.error; err.hidden = false;
  } finally {
    btn.disabled = false; btn.textContent = msgs.send;
  }
});
