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
        labels: ["0 Uhr", "4 Uhr", "8 Uhr", "12 Uhr", "16 Uhr", "20 Uhr", "24 Uhr"],
        datasets: [
          {
            data: this.data?.reduce((items: (number|null)[], item: Measurement) => {
              const value = parseFloat(item.value);
              return items.concat(value === 0 ? null : value);
            }, [] as number[]),
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