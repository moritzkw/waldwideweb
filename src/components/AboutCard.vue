<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    store() {
      return this.$store;
    },
  }});
</script>

<template>
  <v-row>
    <v-col>
      <v-card title="Über uns" :elevation="5" color="green-lighten-4">
        <v-container fluid>
          
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>