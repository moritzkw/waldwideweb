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
import { Update } from "../types/update";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature, EditUserDialog, DeleteUserDialog, AddUserDialog },
  name: "AdminDashboard",

  data() {
    return {
      error: false,
      selectedFile: [],
      newVersion: "",
      addUserDialog: false,
      userToEdit: {
        username: "",
        password: "",
        passwordRepeat: "",
        role: "",
      }
    };
  },
  mounted() {
    this.store.commit("fetchForAdmin");
  },
  watch: {
    selectedFile: function(file) {
      if (file.length > 0) {
        var latestVersion = this.latestUpdate?.version.split(".");
        var newVersionNumber = parseInt(latestVersion[latestVersion.length -  1]) + 1;
        latestVersion[latestVersion.length - 1] = newVersionNumber.toString();
        this.newVersion = latestVersion?.join(".")
      }
    }
  },
  computed: {
    store(): Store<State> {
      return this.$store;
    },
    users() {
      return this.store.state.users;
    },
    latestUpdate(): Update | null {
      if (!this.store.state.updates || this.store.state.updates.length === 0) return null;

      let latestUpdate: Update | null = null;
      this.store.state.updates.forEach((update: Update) => {
        if (!latestUpdate) latestUpdate = update;
        else {
          if (new Date(update.createAt) > new Date(latestUpdate.createAt)) {
            latestUpdate = update
          }
        }
      })
      return latestUpdate;
    }
  },
  methods: {
    PostUpdate() {
      const reader = new FileReader();
      reader.onload = () => {
        this.store.commit("postUpdate", {data: reader.result, version: this.newVersion })
      }
      reader.readAsBinaryString(this.selectedFile[0])
    }
  },
});
</script>

<template>
  <v-container fluid>
    <v-col>
      <v-card class="mb-4 pa-4" elevation="5" title="Sensor Updates" >
        <v-col>
          <v-row>
            <div class="ml-4">Aktuelle Version: {{ latestUpdate?.version }}</div>
            <div class="ml-4 font-italic">({{ latestUpdate ? new Date(latestUpdate!.createAt).toLocaleString() : "keine aktuelle Version"}})</div>
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
            <v-text-field
              v-if="selectedFile.length > 0"
              label="Version"
              class="mr-8"
              v-model="newVersion"
            >
            </v-text-field>
            <v-btn
              :disabled="selectedFile.length === 0"
              append-icon="mdi-upload"
              class="mt-2"
              @click="PostUpdate"
            >Hochladen</v-btn>
            <v-spacer></v-spacer>
          </v-row>
        </v-col>
      </v-card>
      <v-card class="pa-4" elevation="5">
        <AddUserDialog></AddUserDialog>
        <v-btn append-icon="mdi-refresh" class="my-2" @click="store.commit('fetchUsers')">Aktualisieren</v-btn>
        <div class="ml-4 font-italic">Zuletzt aktualisiert: {{ store.state.usersLastUpdated ? store.state.usersLastUpdated.toLocaleString() : "nicht bekannt" }}</div>
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
