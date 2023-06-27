import { createStore } from "vuex";
import {
  AddUser,
  DeleteUser,
  GetAggregatedData,
  GetAreas,
  GetData,
  GetMe,
  GetNodes,
  GetRoles,
  GetTypes,
  GetUpdates,
  GetUsers,
  PostUpdate,
  UpdateNode,
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
import router from "../router";
import { Node } from "../types/node";

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
        sessionExpired: false,
        loggedIn: false,
        loginDialogOpen: false,
        role: "visitor",
      },
      selectedArea: "",
      users: new Array<User>(),
      usersLastUpdated: null,
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
    async fetchForVisitor(state: State) {
      await GetAreas().then((areas) => (state.areas = areas));
      await GetTypes().then((types) => (state.data.types = types));
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
    async fetchForForester(state: State) {
      await GetAreas().then((areas) => (state.areas = areas));
      await GetTypes().then((types) => (state.data.types = types));
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
      await GetNodes().then((nodes) => (state.nodes = nodes));
    },
    async fetchForAdmin(state: State) {
      await GetUsers().then((users) => {
        state.users = users;
        state.usersLastUpdated = new Date();
      });
      await GetRoles().then((roles) => (state.roles = roles));
      await GetUpdates().then((updates) => state.updates = updates);
    },
    startLogin(state: State) {
      state.user.loginDialogOpen = true;
    },
    cancelLogin(state: State) {
      state.user.loginDialogOpen = false;
    },
    async login(state: State, data: { username: string; password: string }) {
      await login(data.username, data.password).then((response) => {
        state.user.loggedIn = response.status === 200;
        if (response.status === 200 && response.data) {
          state.user.loginDialogOpen = true;
          // $cookie.set("token", response.data.token, response.data.expiresAt)
          
          GetMe().then(me => state.user.role = me.role.name).then(() => {
              if (state.user.role === "admin") router.push({ path: "/admin" });
              else if (state.user.role === "förster") router.push({path: "/forester"});
              state.user.loginDialogOpen = false;
          });
        } else {
          state.user.loginDialogOpen = true;
        }
      });
    },
    logout(state: State) {
      logout().then((loggedOut) => {
        state.user.loginDialogOpen = !loggedOut;
        state.user.loggedIn = !loggedOut;
        router.push({path: "/"});
      });
    },
    async checkLogin(state: State) {
      const tokenCookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="));
      
      if (tokenCookie) {
        const me = await GetMe();
        if (me) {
          state.sessionExpired = false;
          state.user.loggedIn = true;
          if (me.role.name === "admin") router.push("/admin");
          else if (me.role.name === "förster") router.push("/forester");
        } else {          
          state.sessionExpired = true;
          state.user.loggedIn = false;
          router.push("/");
        }
      } else {
        state.sessionExpired = false;
        state.user.loggedIn = false;
        router.push("/");
      }
    },
    fetchUsers(state: State) {
      GetUsers().then((users) => {
        state.users = users;
        state.usersLastUpdated = new Date();
      });
    },
    addUser(
      state: State,
      user: { username: string; password: string; roleId: number }
    ) {
      AddUser(user.username, user.password, user.roleId).then(() =>
        GetUsers().then((users) => {
          state.users = users;
          state.usersLastUpdated = new Date();
        })
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
      ).then(() => 
        GetUsers().then((users) => {
          state.users = users;
          state.usersLastUpdated = new Date();
        })
      );
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
        GetUsers().then((users) => {
          state.users = users;
          state.usersLastUpdated = new Date();
        })
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
    },
    updateNode(state: State, data: {node: Node, latitude: number, longitude: number}) {
      UpdateNode(data.node, data.latitude, data.longitude).then(() => {
        GetNodes().then(nodes => state.nodes = nodes);
      })
    }
  },
});
