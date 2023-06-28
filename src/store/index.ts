import { createStore } from "vuex";
import {
  AddUser,
  ChangePassword,
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
import { AggregateMeasurement } from "../types/aggregatedData";

export default createStore({
  state(): State {
    return {
      temperature: {
        latest: null,
        weekHistory: new Array<Array<Measurement>>(),
        weekDayHistory: new Array<Array<Measurement>>(),
        weekMins: new Array<number>(),
        weekMaxes: new Array<number>(),
      },
      humidity: {
        latest: null,
        weekHistory: new Array<Array<Measurement>>(),
        weekDayHistory: new Array<Array<Measurement>>(),
        weekMins: new Array<number>(),
        weekMaxes: new Array<number>(),
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
    async fetchForVisitor(state: State) {
      await GetAreas().then((areas) => (state.areas = areas));
      await GetTypes().then((types) => (state.data.types = types));
      if (state.selectedArea.length === 0)
        state.selectedArea = state.areas[0].areaId;
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const now = new Date();
      const nowMinusOneWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      await GetData(
        state.data.types[2],
        selectedArea.meshNodeUUIDs,
        nowMinusOneWeek,
        now
      ).then((data) => {
        state.temperature.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
      await GetData(
        state.data.types[3],
        [selectedArea.meshNodeUUIDs[0]],
        nowMinusOneWeek,
        now
      ).then((data) => {
        state.humidity.latest = data
          ? (data as Data).data[0].measurements[0]
          : undefined;
      });
    },
    async fetchForForester(state: State) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );
      await GetAreas().then((areas) => (state.areas = areas));
      await GetTypes().then((types) => (state.data.types = types));
      if (state.selectedArea.length === 0)
        state.selectedArea = state.areas[0].areaId;
      await GetData(state.data.types[2], selectedArea.meshNodeUUIDs).then(
        (data) => {
          state.temperature.latest = data
            ? (data as Data).data[0].measurements[0]
            : undefined;
        }
      );
      await GetData(state.data.types[3], selectedArea.meshNodeUUIDs).then(
        (data) => {
          state.humidity.latest = data
            ? (data as Data).data[0].measurements[0]
            : undefined;
        }
      );
      await GetNodes().then((nodes) => (state.nodes = nodes));
    },
    async fetchForAdmin(state: State) {
      await GetUsers().then((users) => {
        state.users = users;
        state.usersLastUpdated = new Date();
      });
      await GetRoles().then((roles) => (state.roles = roles));
      await GetUpdates().then((updates) => (state.updates = updates));
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

          GetMe()
            .then((me) => (state.user.role = me.role.name))
            .then(() => {
              if (state.user.role === "admin") router.push({ path: "/admin" });
              else if (state.user.role === "förster")
                router.push({ path: "/forester" });
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
        router.push({ path: "/" });
      });
    },
    async checkLogin(state: State) {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

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
    async updateUser(
      state: State,
      update: {
        user: User;
        username: string;
        roleId: number;
        password?: string;
      }
    ) {
      await UpdateUser(update.user, update.username, update.roleId);
      if (update.password) await ChangePassword(update.user, update.password);
      await GetUsers().then((users) => {
        state.users = users;
        state.usersLastUpdated = new Date();
      });
    },
    async fetchChartData(
      state: State,
      data: { type: string; measuredStart: Date; measuredEnd: Date }
    ) {
      await GetTypes().then((types) => (state.data.types = types));
      GetData(data.type, undefined, data.measuredStart, data.measuredEnd).then(
        (data) => {
          state.temperature.weekHistory = data
            ? (data as Data).data[0].measurements
            : [];
        }
      );
    },
    async fetchTemperatureChartData(state: State) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const today = new Date();
      var start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.setHours(23, 59, 59, 999));

      GetAggregatedData(
        "temperature",
        AggregateFunction.AVERAGE,
        selectedArea.meshNodeUUIDs,
        start,
        end,
        "4h"
      ).then((data) => {
        for (var i = 0; i < 7; i++) {
          state.temperature.weekHistory[i] = data.samples.slice(
            i * 6,
            i * 6 + 6
          );
        }
      });
    },
    async fetchHumidityChartData(state: State) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const today = new Date();
      var start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.setHours(23, 59, 59, 999));

      GetAggregatedData(
        "humidity",
        AggregateFunction.AVERAGE,
        selectedArea.meshNodeUUIDs,
        start,
        end,
        "4h"
      ).then((data) => {
        for (var i = 0; i < 7; i++) {
          state.humidity.weekHistory[i] = data.samples.slice(i * 6, i * 6 + 6);
        }
      });
    },
    async fetchTemperatureDayData(state: State) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const today = new Date();
      var start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.setHours(23, 59, 59, 999));

      GetAggregatedData(
        "temperature",
        AggregateFunction.AVERAGE,
        selectedArea.meshNodeUUIDs,
        start,
        end,
        undefined,
        7
      ).then((data) => {
        state.temperature.weekDayHistory = data.samples.reduce(
          (values: number[], sample: AggregateMeasurement) => {
            return values.concat(parseFloat(sample.value));
          },
          [] as number[]
        );
      });
    },
    async fetchHumidityDayData(state: State) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const today = new Date();
      var start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.setHours(23, 59, 59, 999));

      GetAggregatedData(
        "humidity",
        AggregateFunction.AVERAGE,
        selectedArea.meshNodeUUIDs,
        start,
        end,
        undefined,
        7
      ).then((data) => {
        state.humidity.weekDayHistory = data.samples.reduce(
          (values: number[], sample: AggregateMeasurement) => {
            return values.concat(parseFloat(sample.value));
          },
          [] as number[]
        );
        // }
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
    async getMinMax(state: State, type: string) {
      const selectedArea = state.areas.find(
        (area: Area) => area.areaId === state.selectedArea
      );

      const today = new Date();
      var start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.setHours(23, 59, 59, 999));

      GetAggregatedData(
        type,
        AggregateFunction.MINIMUM,
        selectedArea.meshNodeUUIDs,
        start,
        end,
        "24h"
      ).then((mins) => {
        const res = mins.samples.reduce(
          (samples: number[], sample: AggregateMeasurement) => {
            return samples.concat(parseFloat(sample.value));
          },
          [] as number[]
        );
        if (type === "temperature") state.temperature.weekMins = res;
        else if (type === "humidity") state.humidity.weekMins = res;
      }),
        GetAggregatedData(
          type,
          AggregateFunction.MAXIMUM,
          selectedArea.meshNodeUUIDs,
          start,
          end,
          "24h"
        ).then((maxes) => {
          const res = maxes.samples.reduce(
            (samples: number[], sample: AggregateMeasurement) => {
              return samples.concat(parseFloat(sample.value));
            },
            [] as number[]
          );
          if (type === "temperature") state.temperature.weekMaxes = res;
          else if (type === "humidity") state.humidity.weekMaxes = res;
        });
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
      ).then(
        (min) => (state.humidity.todaysMin = parseFloat(min.samples[0].value))
      );
      GetAggregatedData(
        data.type,
        AggregateFunction.MAXIMUM,
        undefined,
        data.measuredStart,
        data.measuredEnd,
        undefined,
        1
      ).then(
        (max) => (state.humidity.todaysMax = parseFloat(max.samples[0].value))
      );
    },
    fetchUpdates(state: State) {
      GetUpdates().then((updates) => (state.updates = updates));
    },
    postUpdate(state: State, update: { data: string; version: string }) {
      PostUpdate(update.data, update.version).then(() =>
        GetUpdates().then((updates) => (state.updates = updates))
      );
    },
    updateNode(
      state: State,
      data: { node: Node; latitude: number; longitude: number }
    ) {
      UpdateNode(data.node, data.latitude, data.longitude).then(() => {
        GetNodes().then((nodes) => (state.nodes = nodes));
      });
    },
  },
});
