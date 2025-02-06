<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const activities = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedType = ref('all')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

// Activity types with their corresponding icons and colors
const activityTypes = {
  create: { icon: 'ri-add-circle-line', color: 'success' },
  update: { icon: 'ri-edit-2-line', color: 'info' },
  delete: { icon: 'ri-delete-bin-line', color: 'error' },
  default: { icon: 'ri-information-line', color: 'primary' }
}

const filteredActivities = computed(() => {
  const filtered = activities.value.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.causer?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'all' || activity.type === selectedType.value
    return matchesSearch && matchesType
  })
  
  totalItems.value = filtered.length
  
  // Calculate pagination slice
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return filtered.slice(start, end)
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const fetchActivities = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/activities')
    activities.value = response.data.activities
    currentPage.value = 1 // Reset to first page when fetching new data
  } catch (err) {
    error.value = 'Failed to load activities'
    console.error('Fetch activities error:', err)
  } finally {
    loading.value = false
  }
}

const getActivityTypeInfo = (activity) => {
  const type = activity.description.toLowerCase().includes('created') ? 'create' 
             : activity.description.toLowerCase().includes('updated') ? 'update'
             : activity.description.toLowerCase().includes('deleted') ? 'delete'
             : 'default'
  return activityTypes[type]
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// Reset pagination when filters change
watch([searchQuery, selectedType], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchActivities()
})
</script>

<template>
  <VCard class="activity-log-card">
    <VCardTitle class="d-flex justify-space-between align-center pa-6">
      <div class="d-flex align-center">
        <VIcon icon="ri-history-line" size="large" class="me-3" />
        <h5 class="text-h5 font-weight-bold mb-0">Activity Log</h5>
      </div>
      <div class="d-flex align-center">
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Search activities..."
          prepend-inner-icon="ri-search-line"
          class="search-field me-4"
          hide-details
        />
        <VSelect
          v-model="selectedType"
          :items="[
            { title: 'All Activities', value: 'all' },
            { title: 'Created', value: 'create' },
            { title: 'Updated', value: 'update' },
            { title: 'Deleted', value: 'delete' }
          ]"
          density="compact"
          class="type-select me-4"
          hide-details
        />
        <VBtn
          color="primary"
          @click="fetchActivities"
          :loading="loading"
          elevation="1"
        >
          <VIcon start icon="ri-refresh-line" />
          Refresh
        </VBtn>
      </div>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-6">
      <!-- Error Alert -->
      <VAlert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
        closable
        @click:close="error = null"
      >
        <template v-slot:prepend>
          <VIcon icon="ri-error-warning-line" />
        </template>
        {{ error }}
      </VAlert>
      
      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center align-center pa-12">
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
        />
      </div>

      <!-- Activities Timeline -->
      <div v-else-if="filteredActivities.length" class="activities-timeline">
        <div
          v-for="(activity, index) in filteredActivities"
          :key="activity.id"
          class="timeline-item"
          :class="{ 'last-item': index === filteredActivities.length - 1 }"
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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-center align-center mt-6">
        <VPagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          rounded="circle"
          @update:model-value="handlePageChange"
        />
      </div>

      <!-- Empty State -->
      <VAlert
        v-else-if="!filteredActivities.length"
        type="info"
        variant="tonal"
        class="my-4"
      >
        <template v-slot:prepend>
          <VIcon icon="ri-information-line" />
        </template>
        No activities found matching your criteria.
      </VAlert>
    </VCardText>
  </VCard>
</template>

<style scoped>
.activity-log-card {
  overflow: hidden;
  border-radius: 12px;
}

.search-field {
  max-inline-size: 250px;
}

.type-select {
  max-inline-size: 150px;
}

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
  background: #e0e0e0;
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
  background: white;
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
  background: #f5f5f5;
  font-size: 0.9rem;
  margin-block: 12px;
  margin-inline: 0;
}

.changes-block {
  flex: 1;
}

.changes-title {
  color: #666;
  font-weight: 600;
  margin-block-end: 8px;
}

.change-item {
  display: flex;
  margin-block-end: 4px;
}

.change-key {
  color: #666;
  font-weight: 500;
  margin-inline-end: 8px;
}

.change-value {
  color: #333;
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
  color: #666;
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
