import TutorsClient from "./TutorClient";


export const dynamic = 'force-dynamic';

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const experience = params.experience ? Number(params.experience) : undefined;
  const minRate = params.minRate ? Number(params.minRate) : undefined;
  const maxRate = params.maxRate ? Number(params.maxRate) : undefined;
  const sortBy = String(params.sortBy ?? 'createdAt');
  const sortOrder = String(params.sortOrder ?? 'desc');

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
      {
        cache: 'no-store',
        next: { revalidate: 0 },
      }
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