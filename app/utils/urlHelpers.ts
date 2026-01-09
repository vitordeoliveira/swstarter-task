import { Movie } from '../types/movie';
import { Person } from '../types/person';

export interface PersonWithId {
  name: string;
  id: string;
}

export function getMoviesFromUrls(filmUrls: string[], allFilms: Movie[]): Movie[] {
  const movies: Movie[] = [];
  
  filmUrls.forEach((filmUrl: string) => {
    const filmId = filmUrl.split('/').pop();
    if (filmId) {
      const film = allFilms.find((f) => f.uid === filmId || f._id === filmId);
      if (film) {
        movies.push(film);
      }
    }
  });
  
  return movies;
}

export function getPeopleFromUrls(peopleUrls: string[], allPeople: Person[]): PersonWithId[] {
  const people: PersonWithId[] = [];
  
  peopleUrls.forEach((personUrl: string) => {
    const personId = personUrl.split('/').pop();
    if (personId) {
      const person = allPeople.find((p) => p.uid === personId || p._id === personId);
      if (person && person.name) {
        people.push({
          name: person.name,
          id: person.uid || person._id || personId,
        });
      }
    }
  });
  
  return people;
}

