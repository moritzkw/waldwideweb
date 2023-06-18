import { Store } from "vuex";
import { Role } from "./types/role";
import { Measurement } from "./types/data";

declare module "@vue/runtime-core" {
  interface State {
    temperature: {
      latest: Measurement
      lastWeekHistory: Array<number>;
    };
    humidity: {
      latest: Measurement;
      lastWeekHistory: Array<number>;
    };


    user: {
      loggedIn: boolean;
      loggingIn: boolean;
      loggingOut: boolean;
      roles: string;
    };
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
