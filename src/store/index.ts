import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    isAuth: false,
    users: [
      { id: "1", name: "Alice", role: 0, created_at: "2023-05-01", updated_at: "2023-05-02" },
      { id: "2", name: "Bob", role: 1, created_at: "2023-05-02", updated_at: "2023-05-03" },
      { id: "3", name: "Charlie", role: 0, created_at: "2023-05-03", updated_at: "2023-05-04" },
      { id: "4", name: "David", role: 1, created_at: "2023-05-04", updated_at: "2023-05-05" },
      { id: "5", name: "Eve", role: 0, created_at: "2023-05-05", updated_at: "2023-05-06" },
      { id: "6", name: "Frank", role: 1, created_at: "2023-05-06", updated_at: "2023-05-07" },
      { id: "7", name: "Grace", role: 0, created_at: "2023-05-07", updated_at: "2023-05-08" },
      { id: "8", name: "Henry", role: 1, created_at: "2023-05-08", updated_at: "2023-05-09" },
      { id: "9", name: "Isaac", role: 0, created_at: "2023-05-09", updated_at: "2023-05-10" },
      { id: "10", name: "Jane", role: 1, created_at: "2023-05-10", updated_at: "2023-05-11" },
    ],
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
