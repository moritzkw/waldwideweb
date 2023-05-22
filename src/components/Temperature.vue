<script lang="ts">
import { defineComponent } from "vue";
import { GChart } from "vue-google-charts";

export default defineComponent({
  components: { GChart },
  data() {
    return {
      dialogOpen: false,
      weekDays: this.fillWeekDays(),
      tab: null,
      chartData: [
        ["Uhrzeit", "Temperatur"],
        ["0 Uhr", 4],
        ["6 Uhr", 10],
        ["12 Uhr", 15],
        ["18 Uhr", 17],
        ["24 Uhr", 11],
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
  methods: {
    fillWeekDays() {
      const weekDays = [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
      ];
      let week: string[] = [];
      const today = new Date();
      for (let i = today.getDay() - 7; i < today.getDay(); i++) {
        if (i < 0) week.push(weekDays[i + 7]);
        else week.push(weekDays[i]);
      }
      // this.tab = week[6];
      return week;
    },
  },
});
</script>

<template>
  <v-dialog v-model="dialogOpen" max-width="800px">
    <template v-slot:activator="{ props }">
      <v-card class="card" title="Temperatur" :elevation="0" v-bind="props">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-white-balance-sunny"
            color="yellow"
            size="x-large"
          />
          <div class="text-h2 ml-4">
            {{ store.state.temperature.current }}°C
          </div>
        </div>
      </v-card>
    </template>

    <v-card title="Temperatur">
      <v-tabs v-model="tab" align-tabs="center" center-active show-arrows>
        <!-- <v-tab value="one">Item One</v-tab>
        <v-tab value="two">Item Two</v-tab>
        <v-tab value="three">Item Three</v-tab> -->
        <v-tab v-for="day in weekDays" :value="day">{{ day }}</v-tab>
      </v-tabs>
      <v-card>
        <v-window v-model="tab">
          <v-window-item v-for="day in weekDays" :value="day">
            <v-container>
              <v-row>
                <v-col>
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-thermometer"
                      color="grey"
                      size="x-large"
                    />
                    <div class="text-h2">17°C</div>
                    <v-col class="ml-6">
                      <div class="text-h7">Min: 4°C</div>
                      <div class="text-h7">Max: 18°C</div>
                    </v-col>
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
          </v-window-item>
        </v-window>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<style>
</style>