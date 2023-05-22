import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

type Content = {
  id: string;
  title: string;
  description: string;
};

export default new Vuex.Store({
  state: {
    currentUser: null,
    isAuth: false,
    contents: [],
  },
  getters: {
    currentUser: (state) => state.currentUser,
    isAuth: (state) => state.isAuth,
    currentContents(state: any): any {
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
