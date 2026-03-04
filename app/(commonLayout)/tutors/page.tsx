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
      `${process.env.API_URL || "https://skill-bridge-server-tau.vercel.app/api"}/tutors?${query.toString()}`,

      { cache: 'no-store', next: { revalidate: 0 },

  signal: AbortSignal.timeout(15000)  }
    );

    if (res.ok) {
      const json = await res.json();
      console.log('Server fetch status:', res.status);
console.log('Server fetch full JSON:', JSON.stringify(json, null, 2));
      const data = json.data ?? {};
      initialTutors = data.data ?? [];
      initialTotalCount = data.meta?.total ?? initialTutors.length;
      console.log('Passing to client → tutors count:', initialTutors.length, 'total:', initialTotalCount);
    }
  } catch (err) {
    console.error('Initial tutors fetch failed:', err);
  }
  if (initialTutors.length === 0) {
  initialTutors = [{ id: 'test-1', name: 'Test Tutor (hardcoded)' }]; // whatever TutorCard expects
  initialTotalCount = 1;
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