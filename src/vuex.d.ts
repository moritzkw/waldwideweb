import { Store } from "vuex";
import { Role } from "./types/role";
import { Measurement } from "./types/data";
import { Area } from "./types/area";

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
    nodes: Node[];
    areas: Area[];
    users: User[];
    data: {
      types: string[];
    };
    roles: Role[]
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
