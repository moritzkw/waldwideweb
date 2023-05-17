<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature },
  name: "AdminDashboard",

  data() {
    return {
    }
  },
});
</script>

<template>
  <v-container>
    Admin Dashboard in progress...
  </v-container>
</template>

<style>
.card:hover {
  cursor: pointer;
}
</style>
