import { Content } from "@/types/Content";

export type StateType = {
  currentUser: any;
  isAuth: boolean;
  contents: Content[];
  currentCount: number;
};
