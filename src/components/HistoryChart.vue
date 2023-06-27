<script lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { defineComponent } from "vue";
import { Measurement } from "../types/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: "LineChart",
  components: { Line },
  props: {
    data: Array<Measurement>
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        style: {
          dataset: {
            backgroundColor: "rgba(46, 125, 50, 0.2)",
            borderColor: "rgba(46, 125, 50, 1)",
            borderWidth: 1,
            pointStyle: "circle",
            pointRadius: 2,
          },
        },
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: ["0 Uhr", "6 Uhr", "12 Uhr", "18 Uhr"],
        datasets: [
          {
            data: [17, 21, 22, 16],
            borderColor: "rgba(46, 125, 50, 1)",
          },
        ],
      }
    },
  }
});
</script>

<template>
  <v-card>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </v-card>
</template>