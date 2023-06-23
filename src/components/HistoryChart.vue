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
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: ["0 Uhr", "6 Uhr", "12 Uhr", "18 Uhr"],
        datasets: [{ data: [17, 18, 22, 24] }],
      }
    },
  }
});
</script>

<template>
  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>