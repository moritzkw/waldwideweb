<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

export default defineComponent({
  props: {
    user: Object,
  },
  data: () => ({
    dialogOpen: false,
    display: {},
    inputUsername: "",
    inputPassword: "",
  }),
  mounted() {
    this.display = useDisplay();
    this.inputUsername = this.user.username;
  },
  computed: {
    store() {
      return this.$store;
    },
  },
  methods: {
    Save() {
      this.dialogOpen = false
    },
    Abort() {
      this.dialogOpen = false
    },
  },
  watch:{
    dialogOpen:function(isOpen: boolean, wasOpen: boolean){
      if(wasOpen && !isOpen){
        this.inputUsername = this.user.username;
        this.inputPassword = "";
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
            <v-col>
              <v-text-field
                label="Nutzername"
                v-model="inputUsername"
              ></v-text-field>
              <v-text-field
                v-model="inputPassword"
                label="Neues Passwort"
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="inputPassword"
                label="Neues Passwort wiederholen"
                type="password"
              ></v-text-field>
            </v-col>
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