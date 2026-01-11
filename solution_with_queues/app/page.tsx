import { fetchFilms, fetchPeople } from './actions';
import SearchPage from './components/SearchPage';

export default async function Home() {
  const [people, movies] = await Promise.all([
    fetchPeople(),
    fetchFilms(),
  ]);

  return <SearchPage initialPeople={people} initialMovies={movies} />;
}
