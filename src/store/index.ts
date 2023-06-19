import { createStore } from "vuex";
import { GetAggregatedData, GetAreas, GetData, GetNodes, GetRoles, GetTypes, GetUsers, login, logout } from "../services/services";
import { State } from "vue";
import { AggregateFunction } from "../types/aggregateFunction";
import { Data } from "../types/data";

export default createStore({
  state() {
    return {
      temperature: {
        latest: null,
        lastWeekHistory: null,
      },
      humidity: {
        latest: null,
        lastWeekHistory: null,
      },
      user: {
        loggedIn: false,
        loggingIn: false,
        loggingOut: false,
        role: "visitor",
      },
      selectedArea: "",
      users: [],
      nodes: [],
      areas: [],
      data: {
        types: [],
      },
      roles: [],
    };
  },
  mutations: {
    async fetchData(state: State) {
      await GetData(state.data.types[0], [state.selectedArea]).then(data => state.temperature.latest = (data as Data).data[0].measurements[0]);
    },
    async fetchAll(state: State) {
      await GetTypes().then(types => state.data.types = types);
      await GetUsers().then(users => state.users = users);
      await GetRoles().then(roles => state.roles = roles);
      await GetAggregatedData(state.data.types[0], AggregateFunction.COUNT, undefined, undefined, undefined, undefined, 3).then(data => console.debug(data))
      await GetNodes().then(nodes => state.nodes = nodes);
      state.selectedArea = state.nodes[0].uuid;
      await GetAreas().then(areas => state.areas = areas);
      await GetData(state.data.types[0], [state.selectedArea]).then(data => state.temperature.latest = (data as Data).data[0].measurements[0]);
      console.debug(state)
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