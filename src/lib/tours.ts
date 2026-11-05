import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';

export type TourEntry = CollectionEntry<'tours'>;

export async function getTours(): Promise<TourEntry[]> {
  const all = await getCollection('tours');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function localize(entry: TourEntry, lang: Lang) {
  const d = entry.data;
  const L = lang;
  return {
    slug: entry.id,
    title: d[`title_${L}`],
    summary: d[`summary_${L}`],
    duration: d[`duration_${L}`],
    level: d.level,
    kind: d.kind,
    category: d.category,
    image: d.image,
    price: d.price,
    featured: d.featured,
    itinerary: d.itinerary.map((s) => ({ time: s[`time_${L}`], text: s[`text_${L}`] })),
    includes: d[`includes_${L}`],
    bring: d[`bring_${L}`],
  };
}
export type LocTour = ReturnType<typeof localize>;

export async function getCamino(lang: Lang) {
  const all = (await getCollection('camino')).sort((a, b) => a.data.order - b.data.order);
  return all.map((e) => ({
    n: e.data.n,
    name: e.data[`name_${lang}`],
    range: e.data[`range_${lang}`],
    text: e.data[`text_${lang}`],
    stages: e.data.stages,
    color: e.data.color,
  }));
}
