<script lang="ts">
import { State, defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import Humidity from "./Humidity.vue";
import { GChart } from "vue-google-charts";
import store from "../store/index";
import { Store } from "vuex/types/index.js";
import { Area } from "../types/area";
import { ref } from 'vue';
import Chart from 'chart.js/auto';

// Logo
export default defineComponent({
  components: { Weather, GChart, Temperature, Humidity},
  name: "VisitorDashboard",

  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      forestAreas: [] as Node[],
      
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
  mounted() {
    this.store.commit("fetchForVisitor");
    this.forestAreas = (store as Store<State>).state.nodes.reduce(
      (nodes: Node[], node: Node) => nodes.concat(node.uuid),
      [] as Node[]
    );

    var currentDate = new Date(); // Get the current date and time
      var sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.store.commit("fetchChartData", {type: this.store.state.data.types[0], measuredStart: sevenDaysAgo, measuredEnd: currentDate});

      const ctx = document.getElementById('lineChartVisitor');

      const lineChart = new Chart(ctx, {
      type: 'line',
      forestAreas: ["Wald A", "Wald B", "Wald C", "Wald D", "Wald E"],
      data: {
        labels: ["Donnerstag", "Freitag", "Samstag", "Sonntag", "Montag", "Dienstag", "Mittwoch"],
        datasets: [{
          label: "Besucher",
              data: [83, 147, 154, 169, 65, 49, 2],
              backgroundColor: "rgba(46, 125, 50, 0.2)",
              borderColor: "rgba(46, 125, 50, 1)",
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }});
      lineChart;
  },
  computed: {
    store() {
      return this.$store;
    },
    areas() {
      if (store.state.areas) {
        return (store as Store<State>).state.areas.slice().reduce(
          (areas: Area[], area: Area) => areas.concat(area.areaId),
          [] as Area[]
        );
        // return (store.state.areas as Area[]).reduce((areas: string[], area: Area) => areas.concat(area.areaId.toString()), [] as string[]);
      } else {
        return [];
      }
    },
  },
  methods: {
    updateData() {
      store.commit("fetchForVisitor");
    },
  },
});
</script>

<template>
  <v-alert
    v-model="store.state.sessionExpired"
    text="Ihre letzte Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
    type="warning"
    variant="tonal"
    closable
    @click="store.state.sessionExpired = false"
  ></v-alert>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="5">
          <v-container fluid>
            <v-row justify="space-between">
              <v-col>
                <v-card class="card" title="Temperatur" :elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-white-balance-sunny"
                      color="yellow"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">
                      {{ store.state.temperature.latest ? parseFloat(store.state.temperature.latest.value).toFixed(1) : "-" }}°C
                    </div>
                  </div>
                  <Temperature></Temperature>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="card" title="Luftfeuchtigkeit" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-water-outline" color="blue" size="x-large" />
                    <div class="text-h2 ml-4">
                      {{
                        store.state.humidity.latest
                          ? parseFloat(store.state.humidity.latest.value).toFixed(1)
                          : "-"
                      }}%
                    </div>
                  </div>
                  <Humidity></Humidity>
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
                    <div class="text-h2 ml-4">{{ "-" }} km/h</div>
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
        <v-card class="card" title="Besucherzahl" :elevation="5">
          <v-container>
            <v-row>
              <v-col>
                <div class="d-flex align-center">
                  <div class="text-h2">
                    72<!-- {{ chartData.datasets[0].data[chartData.datasets[0].data.length - 1] }} -->
                  </div>
                  <v-icon icon="mdi-arrow-top-right ml-4" color="green" />
                </div>
              </v-col>
              <v-col fluid>
                <canvas id="lineChartVisitor" width="200" height="200"></canvas>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="card" title="Waldgebiet" :elevation="5">
          <p class="pa-6">
            Wählen Sie das Waldgebiet aus, für das Sie die aktuellen Messwerte anzeigen wollen.
          </p>
          <v-select
            v-model="store.state.selectedArea"
            class="px-6"
            label="Waldgebiet auswählen"
            :items="areas"
            @update:modelValue="updateData"
          ></v-select>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.card:hover {
  cursor: pointer;
}
</style>