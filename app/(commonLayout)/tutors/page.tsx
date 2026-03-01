import TutorsClient from "./TutorClient";


export const dynamic = 'force-dynamic';

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const experience = searchParams.experience ? Number(searchParams.experience) : undefined;
  const minRate = searchParams.minRate ? Number(searchParams.minRate) : undefined;
  const maxRate = searchParams.maxRate ? Number(searchParams.maxRate) : undefined;
  const sortBy = String(searchParams.sortBy ?? 'createdAt');
  const sortOrder = String(searchParams.sortOrder ?? 'desc');

  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('sortBy', sortBy);
  query.set('sortOrder', sortOrder);
  if (experience !== undefined) query.set('experience', String(experience));
  if (minRate !== undefined) query.set('minRate', String(minRate));
  if (maxRate !== undefined) query.set('maxRate', String(maxRate));

  let initialTutors: any[] = [];
  let initialTotalCount = 0;

  try {
    const res = await fetch(
      `https://skill-bridge-server-tau.vercel.app/api/tutors?${query.toString()}`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      const json = await res.json();
      const data = json.data ?? {};
      initialTutors = data.data ?? [];
      initialTotalCount = data.meta?.total ?? initialTutors.length;
    }
  } catch (err) {
    console.error('Initial tutors fetch failed:', err);
  }

  return (
    <TutorsClient
      initialTutors={initialTutors}
      initialTotalCount={initialTotalCount}
      initialPage={page}
      initialSortBy={sortBy}
      initialSortOrder={sortOrder}
      initialMinRate={minRate ?? ''}
      initialMaxRate={maxRate ?? ''}
      initialExperience={experience ?? ''}
    />
  );
}