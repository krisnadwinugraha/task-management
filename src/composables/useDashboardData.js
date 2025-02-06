import { computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useUsersStore } from '../stores/users'

export function useDashboardData() {
  const usersStore = useUsersStore()
  const tasksStore = useTasksStore()

  const totalUsers = computed(() => usersStore.pagination.totalItems)
  const totalTasks = computed(() => tasksStore.pagination.totalItems)
  const loading = computed(() => usersStore.loading || tasksStore.loading)

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
        tension: 0.4
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

  return {
    totalUsers,
    totalTasks,
    loading,
    trendData,
    chartOptions
  }
}
