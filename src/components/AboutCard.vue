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
          Wir sind ein junges Startup, das sich leidenschaftlich auf die Entwicklung responsiver Websites spezialisiert hat. Unser Team besteht aus talentierten Webentwicklern, Designern und kreativen Köpfen, die sich dafür einsetzen, moderne und benutzerfreundliche Websites zu gestalten.
          <br><br>
          Unser Ziel ist es, Ihnen maßgeschneiderte Websites zu bieten, die sowohl ästhetisch ansprechend als auch funktional sind. Wir verstehen, dass Ihre Website Ihr digitales Aushängeschild ist und einen bleibenden Eindruck bei Ihren Besuchern hinterlassen sollte. Deshalb setzen wir auf modernste Designtrends, intuitive Benutzererfahrung und eine nahtlose Navigation, um sicherzustellen, dass Ihre Website nicht nur visuell ansprechend, sondern auch benutzerfreundlich ist.
          <br><br>
          Kontaktieren Sie uns noch heute, um mehr über unsere Dienstleistungen zu erfahren und wie wir Ihnen helfen können, Ihre Online-Ziele zu erreichen. Wir freuen uns darauf, mit Ihnen zusammenzuarbeiten und Ihre Website zum Erfolg zu führen!
          <br><br>
          Euer Responsive Website-Team aus AIB6: <strong>Sven Gatnar, Eric Eisemann, Moritz Kurzweil</strong>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>