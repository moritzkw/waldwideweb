import { Store } from "vuex";
import { Role } from "./types/role";

declare module "@vue/runtime-core" {
  interface State {
    temperature: {
      current: number;
      lastWeekHistory: Array<number>;
    };
    humidity: {
      current: number;
      lastWeekHistory: Array<number>;
    };
    windSpeed: {
      current: number;
      lastWeekHistory: Array<number>;
    };
    visitorCount: {
      current: number;
      lastWeekHistory: Array<number>;
    };
    admin: {
      users: Array<{
        email: string,
        password: string,
      }>,
    };


    user: {
      loggedIn: boolean;
      loggingIn: boolean;
      loggingOut: boolean;
      roles: string;
    };
    users: User[];
    data: {
      types: String[];
    },
    roles: Role[]
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
