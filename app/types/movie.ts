export interface MovieProperties {
  title: string;
  opening_crawl: string;
  characters: string[];
}

export interface Movie {
  properties: MovieProperties;
  _id: string;
  uid: string;
}

