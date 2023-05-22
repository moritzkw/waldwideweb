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
          { email: "moritz@kurzweil.de", password: "1234" },
          { email: "eisen@golem.mc", password: "4321" },
          { email: "sven@gatn.ar", password: "0000" },
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
