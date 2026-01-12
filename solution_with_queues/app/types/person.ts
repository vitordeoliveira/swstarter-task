export interface Person {
  type: 'person';
  name: string;
  uid?: string;
  _id?: string;
  [key: string]: unknown; // Allow other properties from API
}

