export const SITE = {
  name: 'Real Costa Rica Experiences',
  email: 'hello@realcostaricaexperiences.com',
  phone: '+506 6260-5819',
  waNumber: '50662605819',
  instagram: 'https://instagram.com/realcostaricaexperiences',
  facebook: 'https://facebook.com/realcostaricaexperiences',
  // TODO confirmar el usuario de TikTok
  tiktok: 'https://tiktok.com/@realcostaricaexperiences',
  url: 'https://realcostaricaexperiences.com',
};

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];

export const waLink = (text: string) =>
  `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Ruta absoluta (con base) de una página en un idioma. path sin barra inicial: "tours/pacuare" */
export const url = (lang: Lang, path = '') => {
  const p = path.replace(/^\/|\/$/g, '');
  const prefix = lang === 'es' ? '' : '/en';
  return `${base}${prefix}${p ? '/' + p : ''}/`;
};

export const pick = <T extends Record<string, any>>(o: T, key: string, lang: Lang): any =>
  o[`${key}_${lang}`];
