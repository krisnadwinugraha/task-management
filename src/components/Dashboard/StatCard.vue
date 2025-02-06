<script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    trend: {
      type: String,
      required: true
    },
    trendDirection: {
      type: String,
      validator: (value) => ['up', 'down'].includes(value),
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div class="stat-card" :class="{ 'pulse': loading }">
    <div class="stat-icon">{{ icon }}</div>
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <div class="stat-value">{{ value.toLocaleString() }}</div>
      <div class="stat-trend" :class="{ 'positive': trendDirection === 'up' }">
        {{ trendDirection === 'up' ? '↑' : '↓' }} {{ trend }} this week
      </div>
    </div>
  </div>
</template>

<style scoped>
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

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 16px;
    }
  }
</style>
