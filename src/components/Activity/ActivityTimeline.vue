<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  activities: Array,
  getActivityTypeInfo: Function,
  formatTimestamp: Function
})
</script>

<template>
  <div class="activities-timeline">
    <div
      v-for="(activity, index) in activities"
      :key="activity.id"
      class="timeline-item"
      :class="{ 'last-item': index === activities.length - 1 }"
    >
      <div class="timeline-icon" :class="`bg-${getActivityTypeInfo(activity).color}`">
        <VIcon :icon="getActivityTypeInfo(activity).icon" color="white" size="small" />
      </div>
      
      <VCard class="timeline-content" elevation="1">
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="font-weight-medium">{{ activity.description }}</div>
          <VChip
            :color="getActivityTypeInfo(activity).color"
            size="small"
            class="ms-2"
            variant="tonal"
          >
            {{ getActivityTypeInfo(activity).color.toUpperCase() }}
          </VChip>
        </div>

        <div class="changes-section" v-if="activity.changes">
          <div v-if="activity.changes.before && Object.keys(activity.changes.before).length" class="changes-block">
            <div class="changes-title">Before:</div>
            <div 
              v-for="(value, key) in activity.changes.before" 
              :key="key"
              class="change-item"
            >
              <span class="change-key">{{ key }}:</span>
              <span class="change-value">{{ value }}</span>
            </div>
          </div>
          
          <VDivider v-if="activity.changes.before && activity.changes.after" vertical class="mx-4" />

          <div v-if="activity.changes.after && Object.keys(activity.changes.after).length" class="changes-block">
            <div class="changes-title">After:</div>
            <div 
              v-for="(value, key) in activity.changes.after" 
              :key="key"
              class="change-item"
            >
              <span class="change-key">{{ key }}:</span>
              <span class="change-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="meta-section">
          <div class="d-flex align-center">
            <VAvatar size="24" class="me-2">
              <VImg src="https://api.dicebear.com/7.x/initials/svg?seed=JD" />
            </VAvatar>
            <span class="font-weight-medium">{{ activity.causer?.name || 'Unknown' }}</span>
          </div>
          <div class="timestamp">
            <VIcon icon="ri-time-line" size="small" class="me-1" />
            {{ formatTimestamp(activity.created_at) }}
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.activities-timeline {
  position: relative;
  padding-block: 16px;
  padding-inline: 0;
}

.timeline-item {
  position: relative;
  display: flex;
  padding-block-end: 32px;
}

.timeline-item::before {
  position: absolute;
  background: var(--v-theme-border-subtle);
  content: "";
  inline-size: 2px;
  inset-block: 30px 0;
  inset-inline-start: 15px;
}

.timeline-item.last-item::before {
  display: none;
}

.timeline-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  block-size: 32px;
  inline-size: 32px;
  margin-inline-end: 16px;
}

.timeline-content {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background: var(--v-theme-surface);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%), 0 2px 4px -1px rgba(0, 0, 0, 6%);
  color: var(--v-theme-on-surface);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.timeline-content:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 10%) !important;
  transform: translateX(4px);
}

.changes-section {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  background: var(--v-theme-grey-100);
  font-size: 0.9rem;
  margin-block: 12px;
  margin-inline: 0;
}

.changes-block {
  flex: 1;
}

.changes-title {
  color: var(--v-theme-grey-500);
  font-weight: 600;
  margin-block-end: 8px;
}

.change-item {
  display: flex;
  margin-block-end: 4px;
}

.change-key {
  color: var(--v-theme-grey-500);
  font-weight: 500;
  margin-inline-end: 8px;
}

.change-value {
  color: var(--v-theme-grey-900);
}

.meta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-block-start: 12px;
}

.timestamp {
  display: flex;
  align-items: center;
  color: var(--v-theme-grey-500);
}

/* Color utilities */
.bg-success {
  background-color: #4caf50;
}

.bg-info {
  background-color: #2196f3;
}

.bg-error {
  background-color: #f44336;
}

.bg-primary {
  background-color: #6200ea;
}
</style>
