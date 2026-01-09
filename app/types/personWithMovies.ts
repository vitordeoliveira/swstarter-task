import { Movie } from './movie';

export interface PersonWithMovies {
  properties: {
    name: string;
    birth_year?: string;
    gender?: string;
    eye_color?: string;
    hair_color?: string;
    height?: string;
    mass?: string;
    films?: string[];
    [key: string]: any;
  };
  _id: string;
  uid: string;
  movies: Movie[];
}

