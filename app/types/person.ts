export interface Person {
  name: string;
  uid?: string;
  _id?: string;
  [key: string]: any; // Allow other properties from API
}

