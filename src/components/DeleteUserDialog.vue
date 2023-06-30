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
  }),
  mounted() {
    this.display = useDisplay();
  },
  computed: {
    store() {
      return this.$store;
    },
  },
  methods: {
    Delete() {
      this.store.commit("deleteUser", this.user);
    },
  },
});
</script>

c
<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOpen" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn flat icon="mdi-delete" v-bind="props"></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Nutzer löschen</span>
        </v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie folgenden Nutzer löschen möchten?
        </v-card-text>
        <div class="text-h6 ml-8">{{ user.email }}</div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="dialogOpen = false"
          >
            Abbrechen
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="Delete"
            >Löschen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>