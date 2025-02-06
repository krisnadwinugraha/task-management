<script setup>
import ActivityPagination from '@/components/Activity/ActivityPagination.vue'
import ActivitySearch from '@/components/Activity/ActivitySearch.vue'
import ActivityTimeline from '@/components/Activity/ActivityTimeline.vue'
import useActivityLog from '@/composables/useActivityLog'
import { onMounted } from 'vue'

const {
  activities,
  loading,
  error,
  searchQuery,
  selectedType,
  currentPage,
  itemsPerPage,
  totalItems,
  filteredActivities,
  totalPages,
  fetchActivities,
  getActivityTypeInfo,
  formatTimestamp,
  handlePageChange
} = useActivityLog()

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
      <ActivitySearch
        :search-query="searchQuery"
        :selected-type="selectedType"
        :loading="loading"
        @update:search-query="searchQuery = $event"
        @update:selected-type="selectedType = $event"
        @refresh="fetchActivities"
      />
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
      <ActivityTimeline
        v-else
        :activities="filteredActivities"
        :get-activity-type-info="getActivityTypeInfo"
        :format-timestamp="formatTimestamp"
      />

      <!-- Pagination -->
      <ActivityPagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="handlePageChange"
      />

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
  background-color: var(--v-theme-surface);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%), 0 2px 4px -1px rgba(0, 0, 0, 6%);
  color: var(--v-theme-on-surface);
}
</style>
