import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

type Content = {
  id: string;
  title: string;
  description: string;
};

type StateType = {
  currentUser: any;
  isAuth: boolean;
  contents: Content[];
};

export default new Vuex.Store({
  state: {
    currentUser: null,
    isAuth: false,
    contents: [
      {
        id: "",
        title: "",
        description: "",
      },
    ],
  },
  getters: {
    currentUser: (state: StateType): any => state.currentUser,
    isAuth: (state: StateType): boolean => state.isAuth,
    currentContents(state: StateType): Content[] {
      return state.contents;
    },
  },
  mutations: {
    setCurrentUser(state, newCurrentUser) {
      state.currentUser = newCurrentUser;
    },
    setIsAuth(state, newIsAuth) {
      state.isAuth = newIsAuth;
    },
    setCurrentContents(state, newUsers) {
      state.contents = newUsers;
    },
  },
  actions: {},
  modules: {},
});
