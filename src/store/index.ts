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
  state(): State {
    return {
      temperature: {
        latest: null,
        lastWeekHistory: [],
        todaysMin: null,
        todaysMax: null,
      },
      humidity: {
        latest: null,
        lastWeekHistory: [],
        todaysMin: null,
        todaysMax: null,
      },
      user: {
        loggedIn: false,
        loginDialogOpen: false,
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
      await GetData(state.data.types[0], [state.selectedArea]).then((data) => {
        state.temperature.lastWeekHistory = data
          ? (data as Data).data[0].measurements
          : [];
      });
    },
    async fetchAll(state: State) {
      await GetTypes().then((types) => (state.data.types = types));
      await GetUsers().then((users) => (state.users = users));
      await GetRoles().then((roles) => (state.roles = roles));
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
      state.user.loginDialogOpen = true;
    },
    cancelLogin(state: State) {
      state.user.loginDialogOpen = false;
    },
    login(state: State, data: { username: string; password: string }) {
      login(data.username, data.password).then((response) => {
        state.user.loggedIn = response.status === 200;
        state.user.loginDialogOpen = response.status !== 200;
        if (response.status === 200 && response.data) {
          // $cookie.set("token", response.data.token, response.data.expiresAt)
        }
      });
    },
    logout(state: State) {
      logout().then((loggedOut) => {
        state.user.loginDialogOpen = !loggedOut;
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
      update: { user: User, username: string, roleId: number, password?: string }
    ) {
      UpdateUser(
        update.user,
        update.username,
        update.roleId,
        update.password,
      ).then(() => GetUsers().then((users) => (state.users = users)));
    },
    async fetchChartData(
      state: State,
      data: { type: string; measuredStart: Date; measuredEnd: Date }
    ) {
      await GetTypes().then((types) => (state.data.types = types));
      GetData(
        data.type,
        undefined,
        data.measuredStart,
        data.measuredEnd
      ).then((data) => {
        state.temperature.lastWeekHistory = data
          ? (data as Data).data[0].measurements
          : [];
      });
    },
    deleteUser(state: State, user: User) {
      DeleteUser(user).then(() =>
        GetUsers().then((users) => (state.users = users))
      );
    },
    async getTemperatureRange(
      state: State,
      data: { type: string; measuredStart: Date; measuredEnd: Date }
    ) {
      GetAggregatedData(
        data.type,
        AggregateFunction.MINIMUM,
        undefined,
        data.measuredStart,
        data.measuredEnd,
        undefined,
        1
      ).then(min => state.temperature.todaysMin = parseFloat(min.samples[0].value));
      GetAggregatedData(
        data.type,
        AggregateFunction.MAXIMUM,
        undefined,
        data.measuredStart,
        data.measuredEnd,
        undefined,
        1
      ).then(max => state.temperature.todaysMax = parseFloat(max.samples[0].value));
    },
    async getHumidityRange(
      state: State,
      data: { type: string; measuredStart: Date; measuredEnd: Date }
    ) {
      GetAggregatedData(
        data.type,
        AggregateFunction.MINIMUM,
        undefined,
        data.measuredStart,
        data.measuredEnd,
        undefined,
        1
      ).then(min => state.humidity.todaysMin = parseFloat(min.samples[0].value));
      GetAggregatedData(
        data.type,
        AggregateFunction.MAXIMUM,
        undefined,
        data.measuredStart,
        data.measuredEnd,
        undefined,
        1
      ).then(max => state.humidity.todaysMax = parseFloat(max.samples[0].value));
    },
  },
});
