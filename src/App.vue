<template>
  <v-theme-provider :theme="theme" with-background>
    <v-app>
      <v-main>
        <v-app-bar color="green-darken-3">
          <v-toolbar-title> WaldWideWeb </v-toolbar-title>
          <template v-slot:append>
            <LoginDialog />
            <v-btn :icon="themeIcon" @click="toggleTheme"></v-btn>
          </template>
        </v-app-bar>
        <router-view></router-view>
      </v-main>
    </v-app>
  </v-theme-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VisitorDashboard from "./components/VisitorDashboard.vue";
import ForesterDashboard from "./components/ForesterDashboard.vue";
import LoginDialog from "./components/LoginDialog.vue";

export default defineComponent({
  name: "App",

  components: {
    VisitorDashboard,
    LoginDialog,
    ForesterDashboard
  },

  data() {
    return {
      theme: "light",
      themeIcon: "mdi-brightness-2",
    };
  },
  mounted() {
    console.debug("App mounted")
    this.$store.commit("checkLogin");
  },

  methods: {
    toggleTheme() {
      (this.theme = this.theme === "light" ? "dark" : "light"),
        (this.themeIcon =
          this.theme === "light" ? "mdi-brightness-2" : "mdi-white-balance-sunny");
    },
  },
});
</script>
