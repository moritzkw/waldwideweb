<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";
import { GoogleMap, Marker } from "vue3-google-map";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature, GoogleMap, Marker },
  name: "ForesterDashboard",

  data() {
    return {
      center: { lat: 40.689247, lng: -74.044502 },
      // Array will be automatically processed with visualization.arrayToDataTable function
      forestAreas: ["Wald A", "Wald B", "Wald C", "Wald D", "Wald E"],
      chartData: [
        ["Tag", "Besucher"],
        ["Donnerstag", 83],
        ["Freitag", 147],
        ["Samstag", 154],
        ["Sonntag", 169],
        ["Montag", 65],
        ["Dienstag", 49],
        ["Mittwoch", 72],
      ],
      chartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
        // pointsVisible: true,
        legend: {
          position: "none",
        },
        hAxis: {
          baselineColor: "none",
          textPosition: "none",
          gridlines: { count: "0" },
          minorGridlines: { count: "0" },
        },
        vAxis: {
          textPosition: "none",
          gridlines: { count: "0" },
          minorGridlines: { count: "0" },
        },
        // curveType: 'function'
      },
    };
  },
  computed: {
    store() {
      return this.$store;
    },
  },
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="5">
          <v-container fluid>
            <v-row justify="space-between">
              <v-col>
                <Temperature></Temperature>
              </v-col>
              <v-col>
                <v-card class="card" title="Luftfeuchtigkeit" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-water-outline"
                      color="blue"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">
                      {{ store.state.humidity.latest ? store.state.humidity.latest.value : "-" }}%
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="card" title="Wind" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-weather-windy"
                      color="grey"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">
                      {{ "-" }} km/h
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="card" title="Sensoren" :elevation="5">
          <v-container>
            <GoogleMap api-key="AIzaSyBiaS391syegtj4i98-M0E7ylzmItDTDsc" style="height: 300px" :center="center" :zoom="15">
              <Marker :options="{ position: center }" />
            </GoogleMap>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="card" title="Besucherzahl" :elevation="5">
          <v-container>
            <v-row>
              <v-col>
                <div class="d-flex align-center">
                  <div class="text-h2">
                    {{ "-" }}
                  </div>
                  <v-icon icon="mdi-arrow-top-right ml-4" color="green" />
                </div>
              </v-col>
              <v-col>
                <GChart
                  type="LineChart"
                  :data="chartData"
                  :options="chartOptions"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="card" title="Waldgebiet" :elevation="5">
          <p class="pa-6">
            Wählen Sie das Waldgebiet aus, für das Sie die aktuellen Messwerte
            anzeigen wollen.
          </p>
          <v-combobox
            class="px-6"
            label="Waldgebiet auswählen"
            :items="forestAreas"
          ></v-combobox>
        </v-card>
        <!-- <weather></weather> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.card:hover {
  cursor: pointer;
}
</style>
