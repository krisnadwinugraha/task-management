<script setup>
import { computed, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'

const usersStore = useUsersStore()

// Computed properties from store
const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)

// For pagination
const currentPage = computed({
  get: () => usersStore.pagination.currentPage,
  set: (value) => usersStore.pagination = { ...usersStore.pagination, currentPage: value }
})
const totalPages = computed(() => usersStore.pagination.totalPages)

// Table headers
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Methods
const fetchUsers = (page = 1) => {
  usersStore.fetchUsers(page)
}

const handleEditUser = (user) => {
  // Implement edit user functionality
}

const handleDeleteUser = (user) => {
  // Implement delete user functionality
}

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <VCard class="elevation-2">
      <VCardTitle class="d-flex justify-space-between align-center">
        <h5 class="text-h5">
          Users List
        </h5>
        <div>
          <VBtn
            color="primary"
            class="me-2"
            @click="handleCreateUser"
          >
            <VIcon
              start
              icon="ri-add-line"
            />
            New User
          </VBtn>
          <VBtn
            color="secondary"
            @click="() => fetchUsers(currentPage)"
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

        <!-- Loading Spinner -->
        <VProgressCircular
          v-if="loading"
          indeterminate
          color="primary"
          class="d-flex justify-center my-4"
        />

        <!-- Table -->
        <VTable
          v-if="!loading"
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
              v-for="user in users"
              :key="user.id"
            >
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  class="me-1"
                  @click="handleEditUser(user)"
                >
                  <VIcon icon="ri-edit-line" />
                </VBtn>
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  color="error"
                  @click="handleDeleteUser(user)"
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
            @update:model-value="fetchUsers"
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
          {{ formMode === 'create' ? 'Create New User' : 'Edit User' }}
        </VCardTitle>

        <VCardText>
          <VForm @submit.prevent="handleFormSubmit">
            <VContainer>
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.name"
                    label="Name"
                    required
                    :error-messages="formErrors.name"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="formData.email"
                    label="Email"
                    required
                    :error-messages="formErrors.email"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="formData.password"
                    label="Password"
                    type="password"
                    :error-messages="formErrors.password"
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
          Delete User
        </VCardTitle>

        <VCardText>
          <VAlert
            v-if="deleteError"
            type="error"
            class="mb-4"
          >
            {{ deleteError }}
          </VAlert>

          Are you sure you want to delete the user "{{ currentUser?.name }}"?
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

.elevation-2 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 10%);
}

.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 10%);
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 10%);
}
</style>
