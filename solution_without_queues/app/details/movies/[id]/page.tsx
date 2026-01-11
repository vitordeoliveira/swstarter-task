import { fetchFilmDetails } from '@/app/actions';
import MovieDetails from '@/app/components/MovieDetails';

export default async function MoviesDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const film = await fetchFilmDetails(id);

  return <MovieDetails film={film} />;
}

