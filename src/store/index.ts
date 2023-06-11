import { createStore } from "vuex";
import { login, logout } from "../services/services";
import { State } from "vue";

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
        loggingIn: false,
        loggingOut: false,
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
    startLogin(state: State) {
      state.user.loggingIn = true;
    },
    cancelLogin(state: State) {
      state.user.loggingIn = false;
    },
    login(state: State, data: {username: string, password: string}) {
      login(data.username, data.password).then(loggedIn => {
        state.user.loggedIn = loggedIn;
        state.user.loggingIn = !loggedIn;
      });
    },
    logout(state: State) {
      logout().then(loggedOut => {
        state.user.loggingOut= !loggedOut;
        state.user.loggedIn = !loggedOut;
      });
    },
  }
});