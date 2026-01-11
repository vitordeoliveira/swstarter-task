import { fetchPersonDetails } from '@/app/actions';
import PersonDetails from '@/app/components/PersonDetails';

export default async function PeopleDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const person = await fetchPersonDetails(id);

  return <PersonDetails person={person} />;
}

