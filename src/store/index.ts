import { createStore } from "vuex";
import { GetRoles, GetTypes, GetUsers, login, logout } from "../services/services";
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
      admin: {
        users: [
          { username: "moritz", password: "moritz" },
          { username: "eric", password: "eric" },
          { username: "sven", password: "sven" },
        ]
      },

      user: {
        loggedIn: false,
        loggingIn: false,
        loggingOut: false,
        role: "visitor",
      },
      users: [],
      data: {
        types: [],
      },
      roles: [],
    };
  },
  mutations: {
    fetchData(state: State) {
      GetTypes().then(types => state.data.types = types);
      GetUsers().then(users => state.users = users);
      GetRoles().then(roles => state.roles = roles);
      
    },
    startLogin(state: State) {
      state.user.loggingIn = true;
    },
    cancelLogin(state: State) {
      state.user.loggingIn = false;
    },
    login(state: State, data: {username: string, password: string}) {
      login(data.username, data.password).then(response => {
        state.user.loggedIn = response.status === 200;
        state.user.loggingIn = response.status !== 200;
        if (response.status === 200 && response.data) {
          // $cookie.set("token", response.data.token, response.data.expiresAt)
        }
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