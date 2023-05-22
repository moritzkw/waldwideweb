<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

export default defineComponent({
  data: () => ({
    dialogOpen: false,
    router: {},
    display: {},
  }),
  mounted() {
    this.display = useDisplay();
    this.router = this.$router;
  },
  computed: {
    store() {
      return this.$store;
    },
  },
  methods: {
    Login() {
      this.dialogOpen = false;
      this.router.push({ path: "/admin" });
      this.store.commit("login");
    },
    Logout() {
      this.dialogOpen = false;
      this.router.push({ path: "/" });
      this.store.commit("logout");
    },
    HandleDialogAction() {
      if (this.store.state.user.loggedIn) this.Logout();
      else this.Login();
    }
  },
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOpen" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn
          :icon="store.state.user.loggedIn ? 'mdi-logout' : 'mdi-login'"
          v-bind="props"
        ></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}</span>
        </v-card-title>
        <v-card-text :v-show="!store.state.user.loggedIn">
          <v-container>
            <v-col>
              <v-text-field label="Email*" required></v-text-field>
              <v-text-field
                label="Passwort*"
                type="password"
                required
              ></v-text-field>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="dialogOpen = false"
          >
            Abbrechen
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="HandleDialogAction">
            {{ store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>