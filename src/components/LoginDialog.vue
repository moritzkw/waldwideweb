<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

export default defineComponent({
  data: () => ({
    router: {},
    display: {},
    inputUsername: "H4r4ldD3rH4ck3r",
    inputPassword: "password123",
  }),
  mounted() {
    this.display = useDisplay();
    this.router = this.$router;
  },
  methods: {
    async Login(username: string, password: string) {
      this.$store.commit("login", {username, password});

      this.router.push({ path: "/admin" });
    },
    Logout() {
      this.dialogOpen = false;
      this.$store.commit("logout");
      this.router.push({ path: "/" });
    },
    HandleDialogAction() {
      if (this.$store.state.user.loggedIn) this.Logout();
      else this.Login(this.inputUsername, this.inputPassword);
    },
    CancelLogin() {
      this.$store.commit("cancelLogin");
    }
  },
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="$store.state.user.loggingIn" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn
          :icon="$store.state.user.loggedIn ? 'mdi-logout' : 'mdi-login'"
          v-bind="props"
        ></v-btn>
      </template>
      <v-card v-if="!$store.state.user.loggedIn">
        <v-card-title>
          <span class="text-h5">{{ $store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}</span>
        </v-card-title>
        <v-card-text :v-show="!$store.state.user.loggedIn">
          <v-container>
            <v-col>
              <v-text-field v-model="inputUsername" label="Nutzername*" required></v-text-field>
              <v-text-field
                v-model="inputPassword"
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
            @click="CancelLogin"
          >
            Abbrechen
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="HandleDialogAction">
            {{ $store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <span class="text-h5">{{ $store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="CancelLogin"
          >
            Abbrechen
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="HandleDialogAction">
            {{ $store.state.user.loggedIn ? "Abmelden" : "Anmelden" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>