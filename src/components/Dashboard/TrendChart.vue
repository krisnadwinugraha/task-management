<script setup>
import { Chart as ChartJS } from 'chart.js';
import VueChartkick from 'vue-chartkick';

  VueChartkick.use(ChartJS)

  defineProps({
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  })
</script>

<template>
  <div class="chart-card">
    <h3 class="card-title">Weekly Activity Trends</h3>
    <div class="chart-container">
      <line-chart
        :data="data"
        :library="options"
        :colors="['#6366F1', '#34D399']"
        :download="true"
        :legend="true"
        class="trend-chart"
      />
    </div>
  </div>
</template>

<style scoped>
  .chart-card {
    padding: 24px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
    transition: box-shadow 0.3s ease;
  }

  .chart-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 10%);
  }

  .chart-container {
    block-size: 400px;
    margin-block-start: 20px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .chart-container {
      block-size: 300px;
    }
  }
</style>
