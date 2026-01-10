import { Movie } from '../types/movie';
import { Person } from '../types/person';

export interface PersonWithId {
  name: string;
  id: string;
}

export function getMoviesFromUrls(filmUrls: string[], allFilms: Movie[]): Movie[] {
  const filmMap = new Map<string, Movie>();
  
  // Manually adding this comment here because that idea is really good. (if you see this comment PLEASE let me know)
  // As is a test I added, in a real project I avoid comments like this.
  allFilms.forEach((film) => {
    if (film.uid) filmMap.set(film.uid, film);
    if (film._id) filmMap.set(film._id, film);
  });
  
  const movies: Movie[] = [];
  filmUrls.forEach((filmUrl: string) => {
    const filmId = filmUrl.split('/').pop();
    if (filmId) {
      const film = filmMap.get(filmId);
      if (film) {
        movies.push(film);
      }
    }
  });
  
  return movies;
}

export function getPeopleFromUrls(peopleUrls: string[], allPeople: Person[]): PersonWithId[] {
  const peopleMap = new Map<string, Person>();
 
  allPeople.forEach((person) => {
    if (person.uid) peopleMap.set(person.uid, person);
    if (person._id) peopleMap.set(person._id, person);
  });
  
  const people: PersonWithId[] = [];
  peopleUrls.forEach((personUrl: string) => {
    const personId = personUrl.split('/').pop();
    if (personId) {
      const person = peopleMap.get(personId);
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

