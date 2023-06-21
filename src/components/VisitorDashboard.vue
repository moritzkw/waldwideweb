<script lang="ts">
import { State, defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";
import store from "../store/index";
import { Store } from "vuex/types/index.js";
import { Area } from "../types/area";

// Logo

export default defineComponent({
  components: { Weather, GChart, Temperature },
  name: "VisitorDashboard",

  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      forestAreas: [] as Node[],
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
  mounted() {
    this.forestAreas = (store as Store<State>).state.nodes.reduce(
      (nodes: Node[], node: Node) => nodes.concat(node.uuid),
      [] as Node[]
    );
  },
  computed: {
    store() {
      return this.$store;
    },
    nodes() {
      if (store.state.areas) {
        return (store as Store<State>).state.nodes.reduce(
          (nodes: Node[], node: Node) => nodes.concat(node.uuid),
          [] as Node[]
        );
        // return (store.state.areas as Area[]).reduce((areas: string[], area: Area) => areas.concat(area.areaId.toString()), [] as string[]);
      } else {
        return [];
      }
    },
  },
  methods: {
    updateData() {
      store.commit("fetchData");
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
                    <v-icon icon="mdi-water-outline" color="blue" size="x-large" />
                    <div class="text-h2 ml-4">
                      {{
                        store.state.humidity.latest
                          ? store.state.humidity.latest.value
                          : "-"
                      }}%
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
                    {{ chartData.datasets[0].data[chartData.datasets[0].data.length - 1] }}
                  </div>
                  <v-icon icon="mdi-arrow-top-right ml-4" color="green" />
                </div>
              </v-col>
              <v-col>
                <line :data="chartData" :options="chartOptions"></line>
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
          <v-combobox
            v-model="store.state.selectedArea"
            class="px-6"
            label="Waldgebiet auswählen"
            :items="nodes"
            @update:modelValue="updateData"
          ></v-combobox>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default defineComponent({
  components: { Weather, Temperature, Line },

  name: "VisitorDashboard",

  data() {
    return {
      forestAreas: ["Wald A", "Wald B", "Wald C", "Wald D", "Wald E"],
      chartData: {
        labels: ["Donnerstag", "Freitag", "Samstag", "Sonntag", "Montag", "Dienstag", "Mittwoch"],
        datasets: [
          {
            label: "Besucher",
            data: [83, 147, 154, 169, 65, 49, 72],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            pointStyle: "circle",
            pointRadius: 8,
          },
        ],
      },
      chartOptions: {
  responsive: true,
  maintainAspectRatio: false
},
      humidityValue: 0,
      windSpeed: 0,
      chartInstance: null,
    };
  },
});
</script>

<style>
.card:hover {
  cursor: pointer;
}
</style>