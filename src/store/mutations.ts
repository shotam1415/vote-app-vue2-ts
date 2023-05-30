export const mutations = {
  setCurrentUser(state: any, newCurrentUser: any) {
    state.currentUser = newCurrentUser;
  },
  setIsAuth(state: any, newIsAuth: any) {
    state.isAuth = newIsAuth;
  },
  setCurrentContents(state: any, newUsers: any) {
    state.contents = newUsers;
  },
};
