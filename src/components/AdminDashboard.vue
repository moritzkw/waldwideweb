<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import EditUserDialog from "./EditUserDialog.vue";
import { GChart } from "vue-google-charts";
import EditUserDialogVue from "./EditUserDialog.vue";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature, EditUserDialog },
  name: "AdminDashboard",

  data() {
    return {};
  },
  mounted() {
    console.debug(this.$store.state.admin.users);
  },
  computed: {
    store() {
      return this.$store;
    },
    users() {
      console.debug(this.store.state.admin.users);
      return this.store.state.admin.users;
    },
  },
  methods: {
    Edit(user: any) {
      console.debug("edit " + user.email);
    },
    Delete(user: any) {
      console.debug("delete " + user.email);
    },
  },
});
</script>

<template>
  <v-container fluid>
    <v-col>
      <v-card class="mb-4 pa-4" elevation="5" title="Sensor Updates (aktuell: v1.0.1)">
        <v-col>
          <v-row class="mb-8" v-if="true">
            <v-alert
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd."
              icon="mdi-alert-circle-outline"
              color="error"
            ></v-alert>
          </v-row>
          <v-row>
            <v-file-input label="Binary auswählen" accept=".bin" class="fileinput mr-8"></v-file-input>
            <v-btn append-icon="mdi-upload" class="mt-2">Hochladen</v-btn>
          </v-row>
        </v-col>
      </v-card>
      <v-card class="pa-4" elevation="5">
        <v-btn append-icon="mdi-plus">Nutzer anlegen</v-btn>
        <v-list class="mt-4">
          <v-container class="pa-0" v-bind="user" v-for="user in users">
            <v-list-item :key="user.email" :title="user.email">
              <template v-slot:append>
                <EditUserDialog :user="user"/>
                <v-btn icon="mdi-delete" @click="Delete(user)" flat></v-btn>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </v-container>
        </v-list>
      </v-card>
    </v-col>
  </v-container>
</template>

<style>
.card:hover {
  cursor: pointer;
}
.fileinput {
  max-width: 600px;
}
</style>
