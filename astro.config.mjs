import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambiá SITE si el dominio es otro (GitHub Pages sin dominio propio: https://USUARIO.github.io y base '/REPO').
const site = process.env.SITE_URL || 'https://realcostaricaexperiences.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CR', en: 'en-US' } },
    }),
  ],
  image: { layout: undefined },
});
