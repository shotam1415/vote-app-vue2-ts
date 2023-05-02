import { Timestamp } from 'firebase/firestore'

export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  votes?: any;
}
