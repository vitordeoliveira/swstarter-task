'use server';

import { cache } from 'react';
import { Movie } from './types/movie';
import { Person } from './types/person';
import { PersonWithMovies } from './types/personWithMovies';
import { MovieWithPeople } from './types/movieWithPeople';
import { getMoviesFromUrls, getPeopleFromUrls, PersonWithId } from './utils/urlHelpers';

const cachedFetchFilms = cache(async (): Promise<Movie[]> => {
  const response = await fetch('https://swapi.tech/api/films', {
    next: { revalidate: 3600 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch films');
  }
  
  const data = await response.json() as { result: Movie[] };
  return data.result;
});

export async function fetchFilms(searchTerm?: string): Promise<Movie[]> {
  try {
    const films = await cachedFetchFilms();
    
    if (!searchTerm || searchTerm.trim() === '') {
      return films;
    }
    
    return films.filter((film) =>
      film.properties.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error;
  }
}

const cachedFetchPeople = cache(async (): Promise<Person[]> => {
  const response = await fetch('https://swapi.tech/api/people', {
    next: { revalidate: 3600 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch people');
  }
  
  const data = await response.json() as { results: Person[] };
  return data.results;
});

export async function fetchPeople(searchTerm?: string): Promise<Person[]> {
  try {
    const people = await cachedFetchPeople();
    
    if (!searchTerm || searchTerm.trim() === '') {
      return people;
    }
    
    return people.filter((person) =>
      person.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
}

const cachedFetchPersonDetails = cache(async (id: string) => {
  const response = await fetch(`https://swapi.tech/api/people/${id}`, {
    next: { revalidate: 3600 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch person details');
  }
  
  const data = await response.json();
  return data.result;
});

export async function fetchPersonDetails(id: string): Promise<PersonWithMovies | null> {
  try {
    const personData = await cachedFetchPersonDetails(id);
    
    let movies: Movie[] = [];
    if (personData?.properties?.films && Array.isArray(personData.properties.films)) {
      const allFilms = await fetchFilms();
      movies = getMoviesFromUrls(personData.properties.films, allFilms);
    }
    
    return {
      ...personData,
      movies,
    } as PersonWithMovies;
  } catch (error) {
    console.error('Error fetching person details:', error);
    return null;
  }
}

export async function fetchFilmDetails(id: string): Promise<MovieWithPeople | null> {
  try {
    const films = await fetchFilms();
    const film = films.find((film) => film.uid === id || film._id === id);
    
    if (!film) {
      return null;
    }
    
    let people: PersonWithId[] = [];
    if (film.properties.characters && Array.isArray(film.properties.characters)) {
      const allPeople = await fetchPeople();
      people = getPeopleFromUrls(film.properties.characters, allPeople);
    }
    
    return {
      ...film,
      people,
    };
  } catch (error) {
    console.error('Error fetching film details:', error);
    return null;
  }
}


