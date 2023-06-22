import { createStore } from "vuex";
import {
  AddUser,
  DeleteUser,
  GetAggregatedData,
  GetAreas,
  GetData,
  GetNodes,
  GetRoles,
  GetTypes,
  GetUsers,
  UpdateUser,
  login,
  logout,
} from "../services/services";
import { State } from "vue";
import { AggregateFunction } from "../types/aggregateFunction";
import { Data } from "../types/data";
import { User } from "../types/user";

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
      await GetData(state.data.types[0], [state.selectedArea]).then((data) => {
        state.temperature.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
      await GetData(state.data.types[1], [state.selectedArea]).then((data) => {
        state.humidity.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
    },
    async fetchAll(state: State) {
      await GetTypes().then((types) => (state.data.types = types));
      await GetUsers().then((users) => (state.users = users));
      await GetRoles().then((roles) => (state.roles = roles));
      await GetAggregatedData(
        state.data.types[0],
        AggregateFunction.COUNT,
        undefined,
        undefined,
        undefined,
        undefined,
        3
      ).then((data) => console.debug(data));
      await GetNodes().then((nodes) => (state.nodes = nodes));
      state.selectedArea = state.nodes[0].uuid;
      await GetAreas().then((areas) => (state.areas = areas));
      await GetData(state.data.types[0], [state.selectedArea]).then((data) => {
        state.temperature.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
      await GetData(state.data.types[1], [state.selectedArea]).then((data) => {
        state.humidity.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
    },
    startLogin(state: State) {
      state.user.loggingIn = true;
    },
    cancelLogin(state: State) {
      state.user.loggingIn = false;
    },
    login(state: State, data: { username: string; password: string }) {
      login(data.username, data.password).then((response) => {
        state.user.loggedIn = response.status === 200;
        state.user.loggingIn = response.status !== 200;
        if (response.status === 200 && response.data) {
          // $cookie.set("token", response.data.token, response.data.expiresAt)
        }
      });
    },
    logout(state: State) {
      logout().then((loggedOut) => {
        state.user.loggingOut = !loggedOut;
        state.user.loggedIn = !loggedOut;
      });
    },
    addUser(
      state: State,
      user: { username: string; password: string; roleId: number }
    ) {
      AddUser(user.username, user.password, user.roleId).then(() =>
        GetUsers().then((users) => (state.users = users))
      );
    },
    updateUser(
      state: State,
      update: { user: User; username: string; password: string; roleId: number }
    ) {
      UpdateUser(
        update.user,
        update.username,
        update.password,
        update.roleId
      ).then(() => GetUsers().then((users) => (state.users = users)));
    },
    deleteUser(state: State, user: User) {
      DeleteUser(user).then(() =>
        GetUsers().then((users) => (state.users = users))
      );
    },
  },
});
