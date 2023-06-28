import { Store } from "vuex";
import { Role } from "./types/role";
import { Measurement } from "./types/data";
import { Area } from "./types/area";
import { Update } from "./types/update";

declare module "@vue/runtime-core" {
  interface State {
    temperature: {
      latest?: Measurement
      weekHistory: Array<Array<Measurement>>;
      weekDayHistory: Array<Array<Measurement>>;
      weekMins: Array<number>;
      weekMaxes: Array<number>;
    };
    humidity: {
      latest?: Measurement;
      weekHistory: Array<Array<Measurement>>;
      weekDayHistory: Array<Array<Measurement>>;
      weekMins: Array<number>;
      weekMaxes: Array<number>;
    };

    user: {
      loggedIn: boolean;
      sessionExpired: boolean;
      loginDialogOpen: boolean;
      role: string;
    };
    selectedArea: string;
    nodes: Array<Node>;
    areas: Array<Area>;
    users: Array<User>;
    usersLastUpdated: Date;
    data: {
      types: Array<string>;
    };
    roles: Role[],
    updates: Array<Update>
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
