<script lang="ts">
import { State, defineComponent } from "vue";
import { useDisplay } from "vuetify";
import { Store } from "vuex/types/index.js";
import { Role } from "../types/role";

export default defineComponent({
  props: {
    user: Object,
  },
  data: () => ({
    dialogOpen: false,
    display: {},
    username: "",
    password: "",
    passwordRepeat: "",
    role: "",
  }),
  mounted() {
    this.display = useDisplay();
    this.username = this.user.username;
    this.role = this.store.state.roles.find(role => role.id === this.user.roleId).name
  },
  computed: {
    store() {
      return this.$store;
    },
    roles() {
      if (this.store.state.roles) {
        return (this.store as Store<State>).state.roles.reduce(
          (roles: Role[], role: Role) => roles.concat(role.name),
          [] as Role[]
        );
      } else {
        return [];
      }
    }
  },
  methods: {
    Save() {
      this.store.commit("updateUser", {
        user: this.user,
        username: this.username,
        password: this.password,
        roleId: this.store.state.roles.find<Role>((role: Role) => role.name === this.role)!.id
      })
      this.dialogOpen = false
    },
    Abort() {
      this.dialogOpen = false
    },
  },
  watch:{
    dialogOpen:function(isOpen: boolean, wasOpen: boolean){
      if(wasOpen && !isOpen){
        this.username = this.user.username;
        this.password = "";
      }
    }
  }
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOpen" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn flat icon="mdi-pencil" v-bind="props"></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Nutzer bearbeiten</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-text-field
                label="Nutzername"
                v-model="username"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Neues Passwort"
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="passwordRepeat"
                label="Neues Passwort wiederholen"
                type="password"
              ></v-text-field>
              <v-combobox
                v-model="role"
                label="Nutzerrolle"
                :items="roles"
                required
              ></v-combobox>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="Abort"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="Save"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>