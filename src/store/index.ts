import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    isAuth: false,
    users: [],
  },
  getters: {
    currentUser: (state) => state.currentUser,
    isAuth: (state) => state.isAuth,
    users: (state) => state.users,
  },
  mutations: {
    setCurrentUser(state, newCurrentUser) {
      state.currentUser = newCurrentUser;
    },
    setIsAuth(state, newIsAuth) {
      state.isAuth = newIsAuth;
    },
    setUsers(state, newUsers) {
      state.users = newUsers;
    },
  },
  actions: {},
  modules: {},
});
