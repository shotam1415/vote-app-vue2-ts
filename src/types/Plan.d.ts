import { Timestamp } from "firebase/firestore";

export interface Plan {
  id: string;
  title: string;
  description: string;
  created_at: Timestamp;
  update_at: Timestamp;
}
