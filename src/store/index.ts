import { createStore } from "vuex";



export default createStore({
  state() {
    return {
      temperature: {
        current: 17,
        lastWeekHistory: [],
      },
      humidity: {
        current: 43,
        lastWeekHistory: [],
      },
      windSpeed: {
        current: 8,
        lastWeekHistory: [],
      },
      visitorCount: {
        current: 72,
        lastWeekHistory: [],
      },
      user: {
        loggedIn: false,
        role: "visitor",
      },
      admin: {
        users: [
          { username: "moritz", password: "moritz" },
          { username: "eric", password: "eric" },
          { username: "sven", password: "sven" },
        ]
      }
    };
  },
  mutations: {
    login(state: any) {
      state.user.loggedIn = true;
    },
    logout(state: any) {
      state.user.loggedIn = false;
    },
  }
});
