<script setup>
import { computed } from 'vue';
import StatCard from './StatCard.vue';

  const props = defineProps({
    totalUsers: {
      type: Number,
      required: true
    },
    totalTasks: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })

  const stats = computed(() => [
    {
      id: 'users',
      title: 'Total Users',
      value: props.totalUsers,
      trend: '12.5%',
      trendDirection: 'up',
      icon: '👥'
    },
    {
      id: 'tasks',
      title: 'Total Tasks',
      value: props.totalTasks,
      trend: '8.3%',
      trendDirection: 'up',
      icon: '✓'
    }
  ])
</script>

<template>
  <div class="stats-grid">
    <StatCard
      v-for="stat in stats"
      :key="stat.id"
      v-bind="stat"
      :loading="loading"
    />
  </div>
</template>

<style scoped>
  .stats-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
