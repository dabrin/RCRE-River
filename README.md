# Real Costa Rica Experiences · sitio web (Opción C, "Río")

Sitio estático hecho con **Astro 5** + TypeScript, sin frameworks de UI. Bilingüe (ES en `/`, EN en `/en/`).
El diseño de referencia vive en `../referencia-diseno/`.

## Correrlo en local

```bash
npm i && npm run dev      # http://localhost:4321 (o el siguiente puerto libre)
npm run build             # genera dist/
npm run preview           # sirve dist/ para probar el build
```

Requiere Node 20 o superior.

## Dónde se edita cada cosa

| Qué | Dónde |
|---|---|
| Tours (uno por archivo) | `src/content/tours/*.md` |
| Tramos del Camino de Costa Rica | `src/content/camino/*.md` |
| Galería de fotos y videos | `src/content/gallery.json` |
| Textos de la interfaz (ES/EN) | `src/i18n/ui.ts` |
| Teléfono, correo, redes | `src/lib/site.ts` |
| Colores, radios, tipografía | variables al inicio de `src/styles/global.css` |
| Fotos | `src/assets/img/` |

### Agregar o editar un tour
Copiá cualquier archivo de `src/content/tours/` y cambiá el nombre (el nombre del archivo es la URL: `pacuare.md` → `/tours/pacuare` y `/en/tours/pacuare`). Campos:

```yaml
title_es / title_en
category: hike | bike | raft | camino
kind: day | weekend | multi        # define el filtro de la página de inicio
duration_es / duration_en
level: 1 | 2 | 3                   # Fácil / Moderado / Exigente
image: "archivo.jpeg"              # nombre de un archivo de src/assets/img/
summary_es / summary_en
itinerary: [{ time_es, time_en, text_es, text_en }]
includes_es / includes_en / bring_es / bring_en   # qué incluye, qué llevar
price: "USD 120"                   # opcional; si no existe no se muestra
featured: true                     # opcional
order: 1                           # orden en la cuadrícula
```

### Fotos
Poné la foto en `src/assets/img/` y referenciala por nombre de archivo. Astro la convierte a AVIF/WebP y genera los tamaños responsivos solos. Conviene subir originales de unos 1600–2400 px de ancho.

### Videos en la galería
En `src/content/gallery.json` hay una entrada `"type": "video"` marcada como `"pending": true` (muestra "Video próximamente"). Para activarla:
- **MP4 propio:** poné el archivo en `public/videos/` y usá `"src": "/videos/mi-video.mp4"`.
- **YouTube:** usá `"youtube": "ID_DEL_VIDEO"` (el código después de `v=`).
- Quitá `"pending": true` y elegí un `"poster"` (foto de `src/assets/img/`).
Para agregar más fotos o videos, duplicá una entrada. `size` puede ser `normal`, `tall` o `big`.

## Formulario de contacto (Web3Forms)
1. Entrá a <https://web3forms.com> y creá una clave de acceso con el correo `hello@realcostaricaexperiences.com` (ahí es donde llegarán los mensajes).
2. Poné la clave en `.env` (hay un ejemplo en `.env.example`):
   ```
   PUBLIC_FORM_KEY=tu-clave
   ```
3. En GitHub Actions: *Settings → Secrets and variables → Actions → New repository secret* con el nombre `PUBLIC_FORM_KEY`.

El asunto de cada correo es `Web: {nombre}`. Hay validación en el cliente, campo *honeypot* anti-spam y estados traducidos. Sin clave (por ejemplo en desarrollo) el formulario abre el correo del visitante como alternativa. La clave es pública por diseño; Web3Forms permite restringirla por dominio desde su panel.

## Despliegue

### GitHub Pages (por defecto)
1. En GitHub: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
2. Cada push a `main` ejecuta `.github/workflows/deploy.yml` y publica en `https://USUARIO.github.io/REPO/`. El workflow detecta la URL y la ruta base solo.
3. Formulario: *Settings → Secrets and variables → Actions → New repository secret* → `PUBLIC_FORM_KEY`.
4. **Dominio propio** (`realcostaricaexperiences.com`): primero apuntá el DNS (`A` a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` y `CNAME` de `www` a `USUARIO.github.io`). Luego creá el archivo `public/CNAME` con el dominio, hacé push y activá *Settings → Pages → Custom domain*. El workflow lo detecta y construye con base `/`.
   (Variables opcionales de Actions `SITE_URL` y `BASE_PATH` fuerzan otros valores.)

### Netlify
*Add new site → Import from Git*. Build command `npm run build`, publish directory `dist`. En *Site settings → Environment variables* agregá `PUBLIC_FORM_KEY`. Dominio en *Domain management*.

### Vercel
*Add New → Project*, framework "Astro" (se detecta solo). Agregá `PUBLIC_FORM_KEY` en *Settings → Environment Variables*. Dominio en *Settings → Domains*.

En Netlify/Vercel el dominio por defecto es `realcostaricaexperiences.com`; si probás en un dominio temporal definí `SITE_URL` con esa URL para que canonical, sitemap y hreflang salgan bien.

## SEO y calidad
- Título, descripción, `hreflang`, canonical y Open Graph por idioma y por tour.
- `sitemap-index.xml` (integración oficial) y `robots.txt` (apunta a `https://realcostaricaexperiences.com`).
- JSON-LD: `TravelAgency` en el inicio y `TouristTrip` + `BreadcrumbList` en cada tour.
- Fuentes autoalojadas (`@fontsource`), imágenes AVIF/WebP con `srcset`, JS mínimo (menú, filtros, modal, galería, formulario).
- Respeta `prefers-reduced-motion`.

## Pendientes del cliente
Ver la lista al final de este archivo.

### Lista de pendientes
- [ ] Itinerarios reales de cada tour (los actuales son de ejemplo, marcados con `TODO confirmar`)
- [ ] "Qué incluye" y "Qué llevar" reales por tour (también de ejemplo)
- [ ] Precios (campo `price`, opcional)
- [ ] Etapas detalladas del Camino de Costa Rica (hoy hay 3 tramos)
- [ ] Videos para la galería (MP4 o enlaces de YouTube)
- [ ] Fotos de bicicleta (el tour de cafetales reutiliza la foto del camino)
- [ ] Usuario real de TikTok (`src/lib/site.ts`, hoy `@realcostaricaexperiences`)
- [ ] Crear la clave de Web3Forms y configurar `PUBLIC_FORM_KEY`
- [ ] Revisar los textos alternativos de las fotos en `src/content/gallery.json`
- [ ] Confirmar el dominio y apuntar el DNS
