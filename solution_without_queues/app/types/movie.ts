export interface MovieProperties {
  title: string;
  opening_crawl: string;
  characters: string[];
}

export interface Movie {
  type: 'movie';
  properties: MovieProperties;
  _id: string;
  uid: string;
}

