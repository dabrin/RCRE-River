import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const step = z.object({
  time_es: z.string(),
  time_en: z.string(),
  text_es: z.string(),
  text_en: z.string(),
});

const tours = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/tours' }),
  schema: z.object({
    title_es: z.string(),
    title_en: z.string(),
    category: z.enum(['hike', 'bike', 'raft', 'camino']),
    kind: z.enum(['day', 'weekend', 'multi']),
    duration_es: z.string(),
    duration_en: z.string(),
    level: z.number().int().min(1).max(3),
    /** Nombre de archivo dentro de src/assets/img/ */
    image: z.string(),
    summary_es: z.string(),
    summary_en: z.string(),
    itinerary: z.array(step),
    includes_es: z.array(z.string()).default([]),
    includes_en: z.array(z.string()).default([]),
    bring_es: z.array(z.string()).default([]),
    bring_en: z.array(z.string()).default([]),
    price: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().default(99),
  }),
});

const camino = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/camino' }),
  schema: z.object({
    order: z.number(),
    n: z.string(),
    name_es: z.string(),
    name_en: z.string(),
    range_es: z.string(),
    range_en: z.string(),
    text_es: z.string(),
    text_en: z.string(),
    /** Cantidad de etapas del tramo (define el ancho en la barra de progreso) */
    stages: z.number(),
    color: z.string(),
  }),
});

export const collections = { tours, camino };
