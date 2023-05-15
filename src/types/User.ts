import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  password?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  votes?: any;
}
