export interface Person {
  name: string;
  uid?: string;
  _id?: string;
  [key: string]: unknown; // Allow other properties from API
}

