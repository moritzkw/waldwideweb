<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

export default defineComponent({
  props: {
    user: Object
  },
  data: () => ({
    dialogOpen: false,
    display: {},
  }),
  mounted() {
    console.debug(this.user)
    this.display = useDisplay();
  },
  computed: {
    store() {
      return this.$store;
    },
  },
  methods: {
    Save() {},
  },
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
              <v-text-field label="Email" v-model="user.email"></v-text-field>
              <v-text-field
                label="Passwort*"
                type="password"
                v-model="user.password"
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
          <v-btn color="blue-darken-1" variant="text" @click="Save"
            >Speichern</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>