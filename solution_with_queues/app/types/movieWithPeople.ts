import { Movie } from './movie';
import { PersonWithId } from '../utils/urlHelpers';

export interface MovieWithPeople extends Movie {
  people: PersonWithId[];
}

