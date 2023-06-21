

<script lang="ts">


export default {
  name: "Test",
  props: {
    msg: String
  },
  mounted() {
    const ctx = document.getElementById('myChart');

    const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  myChart;
  },
}
</script>

<style>
.card:hover {
  cursor: pointer;
}
</style>