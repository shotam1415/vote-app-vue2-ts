import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    isAuth: false
  },
  getters: {
    currentUser: (state) => state.currentUser,
    isAuth: (state) => state.isAuth
  },
  mutations: {
    setCurrentUser (state, newCurrentUser) {
      state.currentUser = newCurrentUser
    },
    setIsAuth (state, newIsAuth) {
      state.isAuth = newIsAuth
    }
  },
  actions: {},
  modules: {}
})
