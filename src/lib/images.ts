import type { ImageMetadata } from 'astro';

const imgs = import.meta.glob<{ default: ImageMetadata }>('/src/assets/img/*.{jpeg,jpg,png,webp}', {
  eager: true,
});

/** Devuelve la imagen de src/assets/img/ por nombre de archivo. */
export function getImg(name: string): ImageMetadata {
  const file = /\.\w+$/.test(name) ? name : `${name}.jpeg`;
  const m = imgs[`/src/assets/img/${file}`];
  if (!m) throw new Error(`Imagen no encontrada en src/assets/img/: ${name}`);
  return m.default;
}
