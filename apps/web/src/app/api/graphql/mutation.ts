import { SiteDiary } from '@/data/site-diary';

/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
}

/** @gqlMutationField */
export function createSiteDiary(input: SiteDiaryInput): SiteDiary {
  return input;
}
