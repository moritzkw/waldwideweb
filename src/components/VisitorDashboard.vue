<script lang="ts">
import { State, defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";
import store from "../store/index";
import { Store } from "vuex/types/index.js";
import { Area } from "../types/area";
import { ref } from 'vue';
import Chart from 'chart.js/auto';


// Logo

export default ({
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

<style>
.card:hover {
  cursor: pointer;
}
</style>