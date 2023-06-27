import { Store } from "vuex";
import { Role } from "./types/role";
import { Measurement } from "./types/data";
import { Area } from "./types/area";
import { Update } from "./types/update";

declare module "@vue/runtime-core" {
  interface State {
    temperature: {
      latest?: Measurement
      lastWeekHistory: Array<Measurement>;
      todaysMin: number,
      todaysMax: number,
    };
    humidity: {
      latest?: Measurement;
      lastWeekHistory: Array<Measurement>;
      todaysMin: number,
      todaysMax: number,
    };

    user: {
      loggedIn: boolean;
      loginDialogOpen: boolean;
      role: string;
    };
    selectedArea: string;
    nodes: Array<Node>;
    areas: Array<Area>;
    users: Array<User>;
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
