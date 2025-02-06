<script setup>
  defineProps({
    activities: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(activity => 
          ['id', 'description', 'created_at', 'type'].every(key => key in activity)
        )
      }
    }
  })

  const getActivityIcon = (type) => {
    const icons = {
      user: '👤',
      task: '📋',
      milestone: '🎯'
    }
    return icons[type] || '📌'
  }
</script>

<template>
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
          {{ getActivityIcon(activity.type) }}
        </div>
        <div class="activity-content">
          <div class="activity-description">{{ activity.description }}</div>
          <div class="activity-time">
            {{ new Date(activity.created_at).toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .activities-card {
    padding: 24px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
    transition: box-shadow 0.3s ease;
  }

  .activities-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 10%);
  }

  .card-title {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    margin-block-end: 20px;
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
</style>

