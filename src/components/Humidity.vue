<script lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue';
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
    // Calculation of the beginning and end of the day
    dialogOpen(dialogOpen: boolean) {
      if (!dialogOpen) return;
      
      var currentDate = new Date(); // Get the current date and time
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
      this.store.commit("getMinMax", "humidity");
      this.store.commit("fetchHumidityChartData");
      this.store.commit("fetchHumidityDayData");

      }
  },
  computed: {
    store() {
      return this.$store;
    },
  },
  methods: {
    fillWeekDays(): Array<string> {
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

<!-- Dialog window which appears when clicking humidity field-->
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
                      icon="mdi-water-outline"
                      color="blue"
                      size="x-large"
                    />
                    <div class="text-h2">{{ 
                        parseFloat(
                          store.state.humidity.weekDayHistory[weekDays.findIndex(weekDay => weekDay === day)]
                        ).toFixed(1)
                      }}%</div>
                    <v-col class="ml-6">
                      <div class="text-h7">
                        Min:
                        {{
                          store.state.humidity.weekMins && store.state.humidity.weekMins[weekDays.findIndex(weekDay => weekDay === day)]
                            ? store.state.humidity.weekMins[weekDays.findIndex(weekDay => weekDay === day)].toFixed(1)
                            : "-"
                        }}%
                      </div>
                      <div class="text-h7">
                        Max:
                        {{
                          store.state.humidity.weekMaxes && store.state.humidity.weekMaxes[weekDays.findIndex(weekDay => weekDay === day)]
                            ? store.state.humidity.weekMaxes[weekDays.findIndex(weekDay => weekDay === day)].toFixed(1)
                            : "-"
                        }}%
                      </div>
                    </v-col>
                  </div>
                </v-col>
                <v-col>
                  <HistoryChart :data="store.state.humidity.weekHistory[weekDays.findIndex(weekDay => weekDay === day)]"></HistoryChart>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card>
    </v-card>
  </v-dialog>
</template>
