<script lang="ts">
import { State, defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import EditUserDialog from "./EditUserDialog.vue";
import DeleteUserDialog from "./DeleteUserDialog.vue";
import { GChart } from "vue-google-charts";
import { Store } from "vuex/types/index.js";
import { Role } from "../types/role";
import AddUserDialog from "./AddUserDialog.vue";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature, EditUserDialog, DeleteUserDialog, AddUserDialog },
  name: "AdminDashboard",

  data() {
    return {
      error: false,
      selectedFile: [],
      addUserDialog: false,
      userToEdit: {
        username: "",
        password: "",
        passwordRepeat: "",
        role: "",
      }
    };
  },
  computed: {
    store(): Store<State> {
      return this.$store;
    },
    users() {
      return this.store.state.users;
    },
  },
  methods: {
    Edit(user: any) {
      console.debug("edit " + user.email);
    },
  },
});
</script>

<template>
  <v-container fluid>
    <v-col>
      <v-card class="mb-4 pa-4" elevation="5" title="Sensor Updates" >
        <v-col>
          <v-row>
            <div class="ml-4">Aktuelle Version: 0.0.1</div>
          </v-row>
          <v-row class="mb-8" v-if="true">
            <v-alert
              class="mt-2"
              v-if="error"
              text="Es ist ein Fehler während des Uploads der neuen Softwareversion aufgetreten!"
              icon="mdi-alert-circle-outline"
              color="error"
            ></v-alert>
          </v-row>
          <v-row>
            <v-file-input
              v-model="selectedFile"
              label="Binary auswählen"
              accept=".bin"
              class="fileinput mr-8"
              variant="solo"
              show-size
            ></v-file-input>
            <v-btn
              :disabled="selectedFile.length === 0"
              append-icon="mdi-upload"
              class="mt-2"
              @click="error=true"
            >Hochladen</v-btn>
          </v-row>
        </v-col>
      </v-card>
      <v-card class="pa-4" elevation="5">
        <AddUserDialog></AddUserDialog>
        <v-btn append-icon="mdi-refresh" class="my-2">Aktualisieren</v-btn>
        <div class="ml-4 font-italic">Zuletzt aktualisiert: 07.06.2023 10:05 Uhr</div>
        <v-list class="mt-4">
          <v-container class="pa-0" v-bind="user" v-for="user in users" :key="user.username" fluid>
            <v-list-item :key="user.username" :title="user.username" >
              <template v-slot:append>
                <EditUserDialog :user="user"/>
                <v-spacer></v-spacer>
                <DeleteUserDialog :user="user" class="ml-4"/>
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
