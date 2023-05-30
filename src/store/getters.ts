import { Content } from "@/types/Content";
import { StateType } from "./StateType";

export const getters = {
  currentUser: (state: StateType): any => state.currentUser,
  isAuth: (state: StateType): boolean => state.isAuth,
  currentContents(state: StateType): Content[] {
    return state.contents;
  },
  currentCount: (state: StateType): number => state.currentCount,
};
