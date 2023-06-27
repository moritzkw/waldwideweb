<script lang="ts">
import { defineComponent } from "vue";
import { GChart } from "vue-google-charts";
import { ref } from 'vue';
import Chart from 'chart.js/auto';
import HistoryChart from "./HistoryChart.vue";

export default defineComponent({
  components: { HistoryChart },
  data() {
    return {
      chartRef: ref(null),
      dialogOpen: false,
      weekDays: this.fillWeekDays(),
      tab: null,
      chartData: [
        ["Uhrzeit", "Luftfeuchtigkeit"],
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
  watch: {
    dialogOpen(dialogOpen: boolean) {
      if (!dialogOpen) return;
      console.debug("Humidity Dialog clicked...")
      var currentDate = new Date(); // Get the current date and time
      var sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      this.store.commit("fetchChartData", {type: this.store.state.data.types[0], measuredStart: sevenDaysAgo, measuredEnd: currentDate});
    }
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
  mounted(){
    var currentDate = new Date(); // Get the current date and time
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    this.store.commit("getHumidityRange", { type: "humidity_dummy", measuredStart: startOfDay, measuredEnd: endOfDay});
  }, 
});
</script>

<template>
  <v-dialog v-model="dialogOpen" activator="parent" max-width="800px">
    <v-card title="Luftfeuchtigkeit">
      <v-tabs v-model="tab" align-tabs="center" center-active show-arrows>
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
                    <div class="text-h2">64%</div>
                    <v-col class="ml-6">
                      <div class="text-h7">Min: 58%</div>
                      <div class="text-h7">Max: 65%</div>
                    </v-col>
                  </div>
                </v-col>
                <v-col>
                  <HistoryChart :data="store.state.humidity.lastWeekHistory"></HistoryChart>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card>
    </v-card>
  </v-dialog>
</template>
