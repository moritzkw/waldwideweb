import { Store } from "vuex";

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
    user: {
      loggedIn: boolean;
      role: string;
    };
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
