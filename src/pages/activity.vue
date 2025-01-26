<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const activities = ref([])
const loading = ref(false)
const error = ref(null)

const fetchActivities = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/activities')
    activities.value = response.data.activities // Access the activities array
  } catch (err) {
    error.value = 'Failed to load activities'
    console.error('Fetch activities error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActivities()
})

const formatChanges = (changes) => {
  const formattedChanges = []
  for (const [key, value] of Object.entries(changes)) {
    formattedChanges.push(`${key}: ${JSON.stringify(value)}`)
  }
  return formattedChanges.join(', ')
}

const formatChangeDetails = (changes) => {
  return Object.entries(changes).map(([key, value]) => {
    return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
  }).join(', ')
}
</script>

<template>
  <div>
    <VCard class="elevation-2">
      <VCardTitle class="d-flex justify-space-between align-center">
        <h5 class="text-h5">
          Activities List
        </h5>
        <VBtn
          color="secondary"
          @click="fetchActivities"
          :loading="loading"
        >
          <VIcon
            start
            icon="ri-refresh-line"
          />
          Refresh
        </VBtn>
      </VCardTitle>

      <VCardText>
        <!-- Error Alert -->
        <VAlert
          v-if="error"
          type="error"
          class="mb-4"
          closable
          @click:close="error = null"
        >
          {{ error }}
        </VAlert>
        
        <!-- Loading Spinner -->
        <VProgressCircular
          v-if="loading"
          indeterminate
          color="primary"
          class="d-flex justify-center my-4"
        />

        <!-- Activities List -->
        <div v-if="!loading && activities.length">
          <VCard
            v-for="activity in activities"
            :key="activity.id"
            class="mb-4 activity-card"
          >
            <VCardTitle class="activity-title">{{ activity.description }}</VCardTitle>
            <VCardText>
              <div class="activity-changes">
                <strong>Changes:</strong> 
                <div v-if="activity.changes.before && Object.keys(activity.changes.before).length">
                  <strong>Before:</strong>
                  <ul>
                    <li v-for="(value, key) in activity.changes.before" :key="key">
                      {{ key.charAt(0).toUpperCase() + key.slice(1) }}: {{ value }}
                    </li>
                  </ul>
                </div>
                <div v-if="activity.changes.after && Object.keys(activity.changes.after).length">
                  <strong>After:</strong>
                  <ul>
                    <li v-for="(value, key) in activity.changes.after" :key="key">
                      {{ key.charAt(0).toUpperCase() + key.slice(1) }}: {{ value }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="activity-causer">
                <strong>Causer:</strong> {{ activity.causer?.name || 'Unknown' }}
              </div>
              <div class="activity-date">{{ new Date(activity.created_at).toLocaleString() }}</div>
            </VCardText>
          </VCard>
        </div>

        <!-- No Activities Message -->
        <VAlert
          v-if="!loading && !activities.length"
          type="info"
          class="my-4"
        >
          No activities found.
        </VAlert>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.elevation-2 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 10%);
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 10%);
}

.activity-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.activity-title {
  font-weight: bold;
  margin-block-end: 8px;
}

.activity-changes {
  margin-block-end: 8px;
}

.activity-causer {
  margin-block-end: 8px;
}

.activity-date {
  color: #757575;
}

ul {
  list-style-type: disc;
  padding-inline-start: 16px;
}

li {
  margin-block-end: 4px;
}
</style>
