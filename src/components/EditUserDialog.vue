<script lang="ts">
import { State, defineComponent } from "vue";
import { useDisplay } from "vuetify";
import { Store } from "vuex/types/index.js";
import { Role } from "../types/role";
import { SubmitEventPromise } from "vuetify/lib/index.js";

// Validation of user data
export default defineComponent({
  props: {
    user: Object,
  },
  data() {
    return {
      dialogOpen: false,
      display: {},
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
          if (value.length === 0 || value?.length > 3) return true;
          return 'Das Passwort muss mindstens 4 Zeichen lang sein.';
        },
      ],
      passwordRepeatRules: [
        value => {
          if (this.password.length === 0 || value === this.password) return true;
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
  mounted() {
    this.display = useDisplay();
    this.username = this.user?.username;
    const currentRole = this.store.state.roles.find((role: Role) => role.id === this.user?.roleId)?.name;
    this.role = currentRole ? currentRole : "";
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
    async Save(event: SubmitEventPromise) {
      const result = await event;
      if (!result.valid) return;

      const roleId = this.store.state.roles.find<Role>((role: Role) => role.name === this.role)!.id;
      const params = this.password ? {
        user: this.user,
        username: this.username,
        password: this.password,
        roleId: roleId
      } : {
        user: this.user,
        username: this.username,
        roleId: roleId
      }

      this.store.commit("updateUser", params)
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

<!-- Layout for dialog that appears when you want to edit an user account. -->
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
            <v-form @submit.prevent="Save">
              <v-text-field
                label="Nutzername"
                v-model="username"
                :rules="usernameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Neues Passwort"
                type="password"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                v-model="passwordRepeat"
                label="Neues Passwort wiederholen"
                type="password"
                :rules="passwordRepeatRules"
                :required="password.length > 0"
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
                  type="submit"
                >
                  Speichern
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>