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
  GetUpdates,
  GetUsers,
  PostUpdate,
  UpdateUser,
  login,
  logout,
} from "../services/services";
import { State } from "vue";
import { AggregateFunction } from "../types/aggregateFunction";
import { Data, Measurement } from "../types/data";
import { User } from "../types/user";
import { Area } from "../types/area";
import { Update } from "../types/update";
import { Role } from "../types/role";

export default createStore({
  state(): State {
    return {
      temperature: {
        latest: null,
        lastWeekHistory: new Array<Measurement>(),
        todaysMin: null,
        todaysMax: null,
      },
      humidity: {
        latest: null,
        lastWeekHistory: new Array<Measurement>(),
        todaysMin: null,
        todaysMax: null,
      },
      user: {
        loggedIn: false,
        loginDialogOpen: false,
        role: "visitor",
      },
      selectedArea: "",
      users: new Array<User>(),
      nodes: new Array<Node>(),
      areas: new Array<Area>(),
      data: {
        types: new Array<string>(),
      },
      roles: new Array<Role>(),
      updates: new Array<Update>(),
    };
  },
  mutations: {
    async fetchData(state: State) {
      const selectedArea = state.areas.find((area: Area) => area.areaId === state.selectedArea);
      await GetData(state.data.types[0], selectedArea.meshNodeUUIDs).then((data) => {
        state.temperature.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
      await GetData(state.data.types[1], selectedArea.meshNodeUUIDs).then((data) => {
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
      await GetAreas().then((areas) => (state.areas = areas));
      await GetTypes().then((types) => (state.data.types = types));
      await GetUsers().then((users) => (state.users = users));
      await GetRoles().then((roles) => (state.roles = roles));
      await GetNodes().then((nodes) => (state.nodes = nodes));
      state.selectedArea = state.areas[0].areaId;
      await GetData(state.data.types[0], state.areas[0].meshNodeUUIDs).then((data) => {
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
    fetchUpdates(state: State) {
      GetUpdates().then(updates => state.updates = updates);
    },
    postUpdate(state: State, update: { data: string, version: string }) {
      PostUpdate(update.data, update.version).then(() => GetUpdates().then((updates) => state.updates = updates));
    }
  },
});
