<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useUsersStore } from '../stores/users'

const tasksStore = useTasksStore()
const usersStore = useUsersStore()

// Store computed properties
const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)
const pagination = computed(() => tasksStore.pagination)

// Search and filter
const searchQuery = ref('')
const selectedStatus = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filtered tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.assigned_to?.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || task.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const formDialog = computed({
  get: () => tasksStore.formDialog,
  set: (value) => tasksStore.formDialog = value
})
const deleteDialog = computed({
  get: () => tasksStore.deleteDialog,
  set: (value) => tasksStore.deleteDialog = value
})
const formMode = computed(() => tasksStore.formMode)
const formLoading = computed(() => tasksStore.formLoading)
const formErrors = computed(() => tasksStore.formErrors)
const deleteError = computed(() => tasksStore.deleteError)
const deleteLoading = computed(() => tasksStore.deleteLoading)
const currentTask = computed(() => tasksStore.currentTask)
const users = computed(() => usersStore.users)
const userLoading = computed(() => usersStore.loading)



// Paginated tasks
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTasks.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage.value))

// Reset pagination when filters change
watch([searchQuery, selectedStatus], () => {
  if (pagination.value.currentPage !== 1) {
    handlePageChange(1)
  }
})

const handlePageChange = (page) => {
  tasksStore.fetchTasks(page)
}

// Form data
const formData = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'low',
  due_date: null,
  assigned_to: null
})

// Status configurations
const statusConfig = {
  completed: { icon: 'ri-check-line', color: 'success' },
  in_progress: { icon: 'ri-time-line', color: 'info' },
  on_hold: { icon: 'ri-pause-line', color: 'warning' },
  pending: { icon: 'ri-timer-line', color: 'grey' }
}

// Priority configurations
const priorityConfig = {
  high: { color: 'error' },
  medium: { color: 'warning' },
  low: { color: 'success' },
  urgent: { color: 'purple' }
}

// Methods
const handleCreateTask = async () => {
  tasksStore.formMode = 'create'
  formData.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
    due_date: null,
    assigned_to: null
  }
  tasksStore.formDialog = true
  await usersStore.fetchUsers()
}

const handleDeleteTask = (task) => {
  tasksStore.currentTask = task
  tasksStore.deleteDialog = true
}

const handleDeleteConfirm = () => {
  tasksStore.deleteTask(currentTask.value.id)
}

const handleFormSubmit = () => {
  const cleanTaskData = {
    title: formData.value.title,
    description: formData.value.description,
    status: formData.value.status,
    priority: formData.value.priority,
    assigned_to: formData.value.assigned_to?.id || formData.value.assigned_to || null,
    due_date: formData.value.due_date
  }

  if (formMode.value === 'create') {
    tasksStore.createTask(cleanTaskData)
  } else {
    tasksStore.updateTask({
      id: currentTask.value.id,
      taskData: cleanTaskData
    })
  }
}

const handleEditTask = async (task) => {
  tasksStore.formMode = 'edit'
  tasksStore.currentTask = task
  formData.value = {
    ...task,
    // Ensure assigned_to is set to the user ID when editing
    assigned_to: task.assigned_to?.id || null,
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null
  }
  tasksStore.formDialog = true
  await usersStore.fetchUsers()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(timestamp)
}

onMounted(() => {
  tasksStore.fetchTasks(1)
})
</script>

<template>
  <VCard class="tasks-card">
    <VCardTitle class="d-flex justify-space-between align-center pa-6">
      <div class="d-flex align-center">
        <VIcon icon="ri-task-line" size="large" class="me-3" />
        <h5 class="text-h5 font-weight-bold mb-0">Tasks Management</h5>
      </div>
      <div class="d-flex align-center">
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Search tasks..."
          prepend-inner-icon="ri-search-line"
          class="search-field me-4"
          hide-details
        />
        <VSelect
          v-model="selectedStatus"
          :items="[
            { title: 'All Tasks', value: 'all' },
            { title: 'Pending', value: 'pending' },
            { title: 'In Progress', value: 'in_progress' },
            { title: 'Completed', value: 'completed' },
            { title: 'On Hold', value: 'on_hold' }
          ]"
          density="compact"
          class="status-select me-4"
          hide-details
        />
        <VBtn
          color="primary"
          class="me-2"
          elevation="1"
          @click="handleCreateTask"
        >
          <VIcon start icon="ri-add-line" />
          New Task
        </VBtn>
        <VBtn
          color="secondary"
          elevation="1"
          @click="() => tasksStore.fetchTasks()"
          :loading="loading"
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

      <!-- Tasks Timeline -->
      <div v-else-if="filteredTasks.length" class="tasks-timeline">
        <div
          v-for="(task, index) in paginatedTasks"
          :key="task.id"
          class="timeline-item"
          :class="{ 'last-item': index === paginatedTasks.length - 1 }"
        >
          <div class="timeline-icon" :class="`bg-${statusConfig[task.status].color}`">
            <VIcon :icon="statusConfig[task.status].icon" color="white" size="small" />
          </div>

          <VCard class="timeline-content" elevation="1">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="font-weight-medium">{{ task.title }}</div>
              <div class="d-flex align-center">
                <VChip
                  :color="statusConfig[task.status].color"
                  size="small"
                  class="me-2"
                  variant="tonal"
                >
                  {{ task.status.replace('_', ' ').toUpperCase() }}
                </VChip>
                <VChip
                  :color="priorityConfig[task.priority].color"
                  size="small"
                  variant="tonal"
                >
                  {{ task.priority.toUpperCase() }}
                </VChip>
              </div>
            </div>

            <div class="task-details">
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <div class="meta-item">
                  <VIcon icon="ri-calendar-line" size="small" class="me-1" />
                  Due: {{ formatDate(task.due_date) }}
                </div>
              </div>
            </div>

            <div class="meta-section">
              <div class="d-flex align-center">
                <VAvatar size="24" class="me-2">
                  <VImg :src="`https://api.dicebear.com/7.x/initials/svg?seed=${task.assigned_to?.name || 'UA'}`" />
                </VAvatar>
                <span class="font-weight-medium">{{ task.assigned_to?.name || 'Unassigned' }}</span>
              </div>
              <div class="d-flex align-center">
                <div class="timestamp me-4">
                  <VIcon icon="ri-time-line" size="small" class="me-1" />
                  {{ formatTimeAgo(task.created_at) }}
                </div>
                <div class="actions">
                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    color="primary"
                    class="me-1"
                    @click="handleEditTask(task)"
                  >
                    <VIcon icon="ri-edit-line" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="handleDeleteTask(task)"
                  >
                    <VIcon icon="ri-delete-bin-line" />
                  </VBtn>
                </div>
              </div>
            </div>
          </VCard>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-center align-center mt-6">
        <VPagination
          v-if="pagination.totalPages > 1"
          v-model="pagination.currentPage"
          :length="pagination.totalPages"
          :total-visible="7"
          rounded="circle"
          @update:model-value="handlePageChange"
        />
      </div>
      </div>

      <!-- Empty State -->
      <VAlert
        v-else
        type="info"
        variant="tonal"
        class="my-4"
      >
        <template v-slot:prepend>
          <VIcon icon="ri-information-line" />
        </template>
        No tasks found matching your criteria.
      </VAlert>
    </VCardText>

    <!-- Form Dialog -->
    <VDialog
      v-model="formDialog"
      max-width="600px"
      persistent
    >
      <VCard>
        <VCardTitle>
          {{ formMode === 'create' ? 'Create New Task' : 'Edit Task' }}
        </VCardTitle>

        <VCardText>
          <VForm @submit.prevent="handleFormSubmit">
            <VContainer>
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.title"
                    label="Title"
                    required
                    :error-messages="formErrors.title"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    v-model="formData.description"
                    label="Description"
                    :error-messages="formErrors.description"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="formData.status"
                    :items="[
                      { title: 'Pending', value: 'pending' },
                      { title: 'In Progress', value: 'in_progress' },
                      { title: 'Completed', value: 'completed' },
                      { title: 'On Hold', value: 'on_hold' }
                    ]"
                    item-title="title"
                    item-value="value"
                    label="Status"
                    required
                    :error-messages="formErrors.status"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="formData.priority"
                    :items="[
                      { title: 'Low', value: 'low' },
                      { title: 'Medium', value: 'medium' },
                      { title: 'High', value: 'high' },
                      { title: 'Urgent', value: 'urgent' }
                    ]"
                    item-title="title"
                    item-value="value"
                    label="Priority"
                    required
                    :error-messages="formErrors.priority"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="formData.assigned_to"
                    :items="users"
                    item-title="name"
                    item-value="id"
                    label="Assign To"
                    :loading="userLoading"
                    clearable
                    :error-messages="formErrors.assigned_to"
                    return-object
                  >
                    <template #no-data>
                      <div class="pa-2">No users available</div>
                    </template>
                  </VSelect>
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="formData.due_date"
                    label="Due Date"
                    type="date"
                    :error-messages="formErrors.due_date"
                  />
                </VCol>
              </VRow>
            </VContainer>
          </VForm>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="grey-darken-1"
            variant="text"
            @click="formDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            :loading="formLoading"
            @click="handleFormSubmit"
          >
            {{ formMode === 'create' ? 'Create' : 'Save' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="500px"
    >
      <VCard>
        <VCardTitle class="text-h5">Delete Task</VCardTitle>

        <VCardText>
          <VAlert
            v-if="deleteError"
            type="error"
            class="mb-4"
          >
            {{ deleteError }}
          </VAlert>

          Are you sure you want to delete the task "{{ currentTask?.title}}"?
          This action cannot be undone.
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="deleteLoading"
            @click="handleDeleteConfirm"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>


<style scoped>
.tasks-card {
  overflow: hidden;
  border-radius: 12px;
}

.search-field {
  max-inline-size: 250px;
}

.status-select {
  max-inline-size: 150px;
}

.tasks-timeline {
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

.task-details {
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 0.9rem;
  margin-block: 12px;
  margin-inline: 0;
}

.task-description {
  color: #333;
  margin-block-end: 8px;
}

.task-meta {
  display: flex;
  color: #666;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
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

.actions {
  display: flex;
  gap: 4px;
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

.bg-warning {
  background-color: #ff9800;
}

.bg-grey {
  background-color: #9e9e9e;
}

.bg-purple {
  background-color: #9c27b0;
}
</style>
