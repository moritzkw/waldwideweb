<template>
  <v-theme-provider :theme="theme" with-background class="pa-10">
    <v-app>
      <v-main>
        <v-app-bar color="green-darken-3">
          <v-toolbar-title> WaldWideWeb </v-toolbar-title>
          <template v-slot:append>
            <v-btn icon="mdi-login"></v-btn>
            <v-btn :icon="themeIcon" @click="toggleTheme"></v-btn>
          </template>
        </v-app-bar>
        <VisitorDashboard />
      </v-main>
    </v-app>
  </v-theme-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VisitorDashboard from "./components/VisitorDashboard.vue";

export default defineComponent({
  name: "App",

  components: {
    VisitorDashboard,
  },

  data() {
    return {
      theme: "light",
      themeIcon: "mdi-brightness-2",
    };
  },

  methods: {
    toggleTheme() {
      (this.theme = this.theme === "light" ? "dark" : "light"),
        (this.themeIcon =
          this.theme === "light" ? "mdi-brightness-2" : "mdi-brightness-5");
    },
  },
});
</script>
