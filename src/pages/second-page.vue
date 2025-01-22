<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useTasksStore } from '../stores/tasks'
  import { useUsersStore } from '../stores/users'

  const tasksStore = useTasksStore()
  const usersStore = useUsersStore()

  // Computed properties from store
  const tasks = computed(() => tasksStore.tasks)
  const loading = computed(() => tasksStore.loading)
  const error = computed(() => tasksStore.error)
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

  // For pagination
  const currentPage = computed({
    get: () => tasksStore.pagination.currentPage,
    set: (value) => tasksStore.pagination = { ...tasksStore.pagination, currentPage: value }
  })
  const totalPages = computed(() => tasksStore.pagination.totalPages)

  // Rest of your options stay the same
  const statusOptions = [/* ... */]
  const priorityOptions = [/* ... */]
  const headers = [/* ... */]
  const formData = ref({/* ... */})

  // Methods
  const fetchTasks = (page = 1) => {
    tasksStore.fetchTasks(page)
  }

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

  const handleEditTask = async (task) => {
    tasksStore.formMode = 'edit'
    tasksStore.currentTask = task
    formData.value = { ...task }
    tasksStore.formDialog = true
    await usersStore.fetchUsers()
  }

  const handleDeleteTask = (task) => {
    tasksStore.currentTask = task
    tasksStore.deleteDialog = true
  }

  const handleDeleteConfirm = () => {
    tasksStore.deleteTask()
  }

  const handleFormSubmit = () => {
    if (formMode.value === 'create') {
      tasksStore.createTask(formData.value)
    } else {
      tasksStore.updateTask({
        id: currentTask.value.id,
        taskData: formData.value
      })
    }
  }

  // Your utility functions stay the same
  const formatDate = (date) => {/* ... */}
  const getStatusColor = (status) => {/* ... */}
  const getPriorityColor = (priority) => {/* ... */}

  onMounted(() => {
    fetchTasks()
  })
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <h5 class="text-h5">
          Tasks List
        </h5>
        <div>
          <VBtn
            color="primary"
            class="me-2"
            @click="handleCreateTask"
          >
            <VIcon
              start
              icon="ri-add-line"
            />
            New Task
          </VBtn>
          <VBtn
            color="secondary"
            @click="() => fetchTasks(currentPage)"
            :loading="loading"
          >
            <VIcon
              start
              icon="ri-refresh-line"
            />
            Refresh
          </VBtn>
        </div>
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

        <!-- Table -->
        <VTable
          :loading="loading"
          hover
          class="elevation-1"
        >
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                class="text-uppercase"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in tasks"
              :key="task.id"
            >
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>
                <span class="text-truncate">{{ task.description }}</span>
              </td>
              <td>
                <VChip
                  :color="getStatusColor(task.status)"
                  size="small"
                  class="text-capitalize"
                >
                  {{ task.status.replace('_', ' ') }}
                </VChip>
              </td>
              <td>
                <VChip
                  :color="getPriorityColor(task.priority)"
                  size="small"
                  class="text-capitalize"
                >
                  {{ task.priority }}
                </VChip>
              </td>
              <td>{{ formatDate(task.due_date) }}</td>
              <td>{{ formatDate(task.created_at) }}</td>
              <td>{{ task.assigned_to?.name || 'Unassigned' }}</td>
              <td>
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
              </td>
            </tr>
          </tbody>
        </VTable>

        <!-- Pagination -->
        <div class="d-flex justify-end mt-4">
          <VPagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            @update:model-value="fetchTasks"
          />
        </div>
      </VCardText>
    </VCard>

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

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="formData.status"
                    :items="statusOptions"
                    item-title="title"
                    item-value="value"
                    label="Status"
                    required
                    :error-messages="formErrors.status"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="formData.assigned_to"
                    :items="users"
                    item-title="name"
                    item-value="id"
                    label="Assign To"
                    :loading="userLoading"
                    clearable
                    :error-messages="formErrors.assigned_to"
                  >
                    <template #no-data>
                      <div class="pa-2">No users available</div>
                    </template>
                  </VSelect>
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="formData.priority"
                    :items="priorityOptions"
                    item-title="title"
                    item-value="value"
                    label="Priority"
                    required
                    :error-messages="formErrors.priority"
                  />
                </VCol>

                <VCol cols="12">
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
        <VCardTitle class="text-h5">
          Delete Task
        </VCardTitle>

        <VCardText>
          <VAlert
            v-if="deleteError"
            type="error"
            class="mb-4"
          >
            {{ deleteError }}
          </VAlert>

          Are you sure you want to delete the task "{{ currentTask?.title }}"?
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
  </div>
</template>

<style scoped>
.text-truncate {
  display: inline-block;
  overflow: hidden;
  max-inline-size: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
