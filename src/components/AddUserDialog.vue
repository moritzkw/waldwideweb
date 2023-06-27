<script lang="ts">
import { State, defineComponent } from 'vue';
import { Store } from 'vuex/types/index.js';
import { Role } from '../types/role';
import { SubmitEventPromise } from 'vuetify/lib/index.js';

export default defineComponent({
  data() {
    return {
      dialogOpen: false,
      username: "",
      password: "",
      passwordRepeat: "",
      role: "",
      usernameRules: [
        value => {
          if (value?.length > 3) return true;
          return 'Der Nutzername muss mindestens 4 Zeichen lang sein.';
        },
      ],
      passwordRules: [
        value => {
          if (value?.length > 3) return true;
          return 'Das Passwort muss mindstens 4 Zeichen lang sein.';
        },
      ],
      passwordRepeatRules: [
        value => {
          if (value === this.password) return true;
          return 'Die Passwörter stimmen nicht überein.';
        },
      ],
      roleRules: [
        value => {
          if (value) return true;
          return 'Bitte wähle eine Nutzerrolle aus.';
        },
      ],
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
    async AddUser(event: SubmitEventPromise) {
      const result = await event;
      if (!result.valid) return;

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
            <v-form @submit.prevent="AddUser">
              <v-text-field
                v-model="username"
                label="Nutzername"
                :rules="usernameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Passwort"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="passwordRepeat"
                label="Passwort wiederholen"
                type="password"
                :rules="passwordRepeatRules"
                required
              ></v-text-field>
              <v-select
                v-model="role"
                label="Nutzerrolle"
                :items="roles"
                :rules="roleRules"
                required
              ></v-select>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="CancelAddUser">
                  Abbrechen
                </v-btn>
                <v-btn type="submit" color="blue-darken-1" variant="text">
                  Erstellen
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-btn>
</template>