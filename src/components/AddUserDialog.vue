<script lang="ts">
import { State, defineComponent } from 'vue';
import { Store } from 'vuex/types/index.js';
import { Role } from '../types/role';

export default defineComponent({
  data() {
    return {
      dialogOpen: false,
      username: "",
      password: "",
      passwordRepeat: "",
      role: "",
    };
  },
  computed: {
    store(): Store<State> {
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
    CheckPasswordRepeat(): boolean {
      if (this.password === this.passwordRepeat) return true;
      return false;
    },
    AddUser() {
      if (this.CheckPasswordRepeat())
      this.store.commit("addUser", {
        username: this.username,
        password: this.password,
        roleId: this.store.state.roles.find<Role>((role: Role) => role.name === this.role)!.id
      })
      this.dialogOpen = false;
    },
    CancelAddUser() {
      this.username = "";
      this.password = "";
      this.passwordRepeat = "";
      this.role = "";
      
      this.dialogOpen = false;
    }
  }
});
</script>

<template>
  <v-btn append-icon="mdi-plus" class="mr-4 my-2">
    Nutzer anlegen
    <v-dialog v-model="dialogOpen" activator="parent" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nutzer anlegen</span>
        </v-card-title>
        <v-card-text :v-show="!$store.state.user.loggedIn">
          <v-container>
            <v-col>
              <v-text-field
                v-model="username"
                label="Nutzername"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Passwort"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="passwordRepeat"
                label="Passwort wiederholen"
                type="password"
                required
              ></v-text-field>
              <v-combobox
                v-model="role"
                label="Nutzerrolle"
                :items="roles"
                required
              ></v-combobox>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="CancelAddUser">
            Abbrechen
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="AddUser">
            Erstellen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>