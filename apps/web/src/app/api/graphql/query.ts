import { siteDiaries as rawSiteDiaries, SiteDiary } from '@/data/site-diary';

/** @gqlQueryField */
export function siteDiaries(): Array<SiteDiary> {
  return rawSiteDiaries;
}

/** @gqlQueryField */
export function siteDiary(id: string): SiteDiary | undefined {
  return rawSiteDiaries.find((entry) => entry.id === id);
}
