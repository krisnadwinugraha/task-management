<script setup>
import { onMounted, ref } from 'vue'
import ActivityFeed from '../components/Dashboard/ActivityFeed.vue'
import DashboardStats from '../components/Dashboard/DashboardStats.vue'
import TrendChart from '../components/Dashboard/TrendChart.vue'
import { useDashboardData } from '../composables/useDashboardData'
import { useTasksStore } from '../stores/tasks'
import { useUsersStore } from '../stores/users'

const usersStore = useUsersStore()
const tasksStore = useTasksStore()
const { totalUsers, totalTasks, loading, trendData, chartOptions } = useDashboardData()

const activities = ref([
  { id: 1, description: "New user registration: Sarah Parker", created_at: "2025-02-02T10:30:00", type: 'user' },
  { id: 2, description: "Task completed: Q4 Report Analysis", created_at: "2025-02-02T09:45:00", type: 'task' },
  { id: 3, description: "Project milestone achieved: Dashboard v2", created_at: "2025-02-02T08:15:00", type: 'milestone' },
  { id: 4, description: "New task assigned: Client Meeting Prep", created_at: "2025-02-02T07:30:00", type: 'task' }
])

onMounted(() => {
  usersStore.fetchUsers()
  tasksStore.fetchTasks()
})
</script>

<template>
  <div class="dashboard-container">
    <DashboardStats
      :total-users="totalUsers"
      :total-tasks="totalTasks"
      :loading="loading"
    />
    
    <TrendChart
      :data="trendData"
      :options="chartOptions"
    />
    
    <ActivityFeed :activities="activities" />
  </div>
</template>

<style scoped>
.dashboard-container {
  display: grid;
  padding: 24px;
  animation: fade-in 0.5s ease-out;
  gap: 24px;
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 1400px;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
}
</style>
