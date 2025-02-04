<script setup>
import { Chart as ChartJS } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import VueChartkick from 'vue-chartkick'
import { useTasksStore } from '../stores/tasks'
import { useUsersStore } from '../stores/users'

// Initialize VueChartkick with Chart.js
VueChartkick.use(ChartJS)

const usersStore = useUsersStore()
const tasksStore = useTasksStore()

const totalUsers = computed(() => usersStore.pagination.totalItems)
const totalTasks = computed(() => tasksStore.pagination.totalItems)
const loading = computed(() => usersStore.loading || tasksStore.loading)

// Enhanced trend data with more points and smoother curve
const trendData = computed(() => [
  {
    name: 'Users',
    data: {
      'Mon': 2300,
      'Tue': 2350,
      'Wed': 2400,
      'Thu': 2420,
      'Fri': 2476,
      'Sat': 2510,
      'Sun': 2550
    }
  },
  {
    name: 'Tasks',
    data: {
      'Mon': 1700,
      'Tue': 1750,
      'Wed': 1780,
      'Thu': 1800,
      'Fri': 1843,
      'Sat': 1890,
      'Sun': 1920
    }
  }
])

const chartOptions = {
  scales: {
    y: { 
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)'
      }
    },
    x: {
      grid: {
        color: 'rgba(200, 200, 200, 0.1)'
      }
    }
  },
  elements: {
    line: {
      tension: 0.4 // Makes lines curved
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  },
  plugins: {
    legend: {
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart'
  }
}

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
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" :class="{ 'pulse': loading }">
        <div class="stat-icon users-icon">👥</div>
        <div class="stat-content">
          <h3 class="stat-title">Total Users</h3>
          <div class="stat-value">{{ totalUsers.toLocaleString() }}</div>
          <div class="stat-trend positive">↑ 12.5% this week</div>
        </div>
      </div>
      <div class="stat-card" :class="{ 'pulse': loading }">
        <div class="stat-icon tasks-icon">✓</div>
        <div class="stat-content">
          <h3 class="stat-title">Total Tasks</h3>
          <div class="stat-value">{{ totalTasks.toLocaleString() }}</div>
          <div class="stat-trend positive">↑ 8.3% this week</div>
        </div>
      </div>
    </div>

    <!-- Trend Chart -->
    <div class="chart-card">
      <h3 class="card-title">Weekly Activity Trends</h3>
      <div class="chart-container">
        <line-chart
          :data="trendData"
          :library="chartOptions"
          :colors="['#6366F1', '#34D399']"
          :download="true"
          :legend="true"
          class="trend-chart"
        />
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="activities-card">
      <h3 class="card-title">Recent Activities</h3>
      <div class="activities-list">
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-item"
          :class="activity.type"
        >
          <div class="activity-icon">
            {{ activity.type === 'user' ? '👤' : activity.type === 'task' ? '📋' : '🎯' }}
          </div>
          <div class="activity-content">
            <div class="activity-description">{{ activity.description }}</div>
            <div class="activity-time">{{ new Date(activity.created_at).toLocaleTimeString() }}</div>
          </div>
        </div>
      </div>
    </div>
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

  .stats-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .stat-card {
    display: flex;
    align-items: center;
    padding: 24px;
    border-radius: 16px;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%), 0 2px 4px -1px rgba(0, 0, 0, 6%);
    color: white;
    gap: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .stat-card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 10%), 0 10px 10px -5px rgba(0, 0, 0, 4%);
    transform: translateY(-5px);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 20%);
    font-size: 2.5rem;
  }

  .stat-content {
    flex: 1;
  }

  .stat-title {
    margin: 0;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    opacity: 0.9;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-block: 8px;
    margin-inline: 0;
  }

  .stat-trend {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .stat-trend.positive {
    color: #34d399;
  }

  .chart-card,
  .activities-card {
    padding: 24px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
    transition: box-shadow 0.3s ease;
  }

  .chart-card:hover,
  .activities-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 10%);
  }

  .card-title {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    margin-block-end: 20px;
  }

  .chart-container {
    block-size: 400px;
    margin-block-start: 20px;
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    background: #f9fafb;
    gap: 16px;
    transition: transform 0.2s ease;
  }

  .activity-item:hover {
    transform: translateX(5px);
  }

  .activity-icon {
    padding: 12px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 5%);
    font-size: 1.5rem;
  }

  .activity-content {
    flex: 1;
  }

  .activity-description {
    color: #1f2937;
    font-weight: 500;
  }

  .activity-time {
    color: #6b7280;
    font-size: 0.875rem;
    margin-block-start: 4px;
  }

  .user { border-inline-start: 4px solid #6366f1; }
  .task { border-inline-start: 4px solid #34d399; }
  .milestone { border-inline-start: 4px solid #f59e0b; }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  .pulse {
    animation: pulse 1.5s infinite;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 16px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .chart-container {
      block-size: 300px;
    }

    .stat-card {
      padding: 16px;
    }
  }
</style>
