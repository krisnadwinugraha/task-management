<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRolesStore } from '../stores/roles'
import { useUsersStore } from '../stores/users'

const usersStore = useUsersStore()
const rolesStore = useRolesStore()

// Computed properties from stores
const users = computed(() => usersStore.users)
const roles = computed(() => rolesStore.roles)
const loading = computed(() => usersStore.loading || rolesStore.loading)
const error = computed(() => usersStore.error)

// Form state
const formDialog = ref(false)
const formMode = ref('create')
const formLoading = ref(false)
const formErrors = ref({})
const searchQuery = ref('')
const selectedRole = ref('all')
const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  roles: []
})

// Delete dialog state
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const deleteError = ref(null)
const currentUser = ref(null)

// For pagination
const currentPage = computed({
  get: () => usersStore.pagination.currentPage,
  set: (value) => usersStore.pagination = { ...usersStore.pagination, currentPage: value }
})
const totalPages = computed(() => usersStore.pagination.totalPages)

// User action types with their corresponding icons and colors
const userActionTypes = {
  create: { icon: 'ri-user-add-line', color: 'success' },
  edit: { icon: 'ri-user-settings-line', color: 'info' },
  delete: { icon: 'ri-user-unfollow-line', color: 'error' }
}

// Filtered users based on search and role
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = selectedRole.value === 'all' || 
      (user.roles && user.roles.includes(selectedRole.value))
    return matchesSearch && matchesRole
  })
})

// Methods
const fetchUsers = (page = 1) => {
  usersStore.fetchUsers(page)
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: []
  }
  formErrors.value = {}
}

const handleCreateUser = () => {
  formMode.value = 'create'
  resetForm()
  formDialog.value = true
}

const handleEditUser = (user) => {
  formMode.value = 'edit'
  formData.value = {
    ...user,
    password: '',
    password_confirmation: '',
    roles: user.roles || []
  }
  formDialog.value = true
}

const handleDeleteUser = (user) => {
  currentUser.value = user
  deleteDialog.value = true
}

const handleFormSubmit = async () => {
  try {
    formLoading.value = true
    formErrors.value = {}

    const payload = { ...formData.value }
    if (formMode.value === 'edit' && !payload.password) {
      delete payload.password
      delete payload.password_confirmation
    }

    if (formMode.value === 'create') {
      await usersStore.createUser(payload)
    } else {
      await usersStore.updateUser(payload.id, payload)
    }

    formDialog.value = false
    fetchUsers(currentPage.value)
  } catch (error) {
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors
    } else {
      console.error('Form submission error:', error)
    }
  } finally {
    formLoading.value = false
  }
}

const handleDeleteConfirm = async () => {
  try {
    deleteLoading.value = true
    deleteError.value = null

    await usersStore.deleteUser(currentUser.value.id)
    deleteDialog.value = false
    fetchUsers(currentPage.value)
  } catch (error) {
    deleteError.value = error.response?.data?.message || 'Error deleting user'
  } finally {
    deleteLoading.value = false
  }
}

// Load initial data
onMounted(async () => {
  await rolesStore.fetchRoles()
  fetchUsers()
})
</script>

<template>
  <VCard class="user-management-card">
    <VCardTitle class="d-flex justify-space-between align-center pa-6">
      <div class="d-flex align-center">
        <VIcon icon="ri-user-settings-line" size="large" class="me-3" />
        <h5 class="text-h5 font-weight-bold mb-0">User Management</h5>
      </div>
      <div class="d-flex align-center">
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Search users..."
          prepend-inner-icon="ri-search-line"
          class="search-field me-4"
          hide-details
        />
        <VSelect
          v-model="selectedRole"
          :items="[
            { title: 'All Roles', value: 'all' },
            ...roles.map(role => ({
              title: role.name,
              value: role.name
            }))
          ]"
          density="compact"
          class="role-select me-4"
          hide-details
        />
        <VBtn
          color="success"
          class="me-2"
          elevation="1"
          @click="handleCreateUser"
        >
          <VIcon start icon="ri-user-add-line" />
          New User
        </VBtn>
        <VBtn
          color="primary"
          @click="() => fetchUsers(currentPage)"
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

      <!-- Users List -->
      <div v-else-if="filteredUsers.length" class="users-list">
        <VCard
          v-for="user in filteredUsers"
          :key="user.id"
          class="user-card mb-4"
          elevation="1"
        >
          <div class="d-flex align-center pa-4">
            <VAvatar size="48" class="me-4">
              <VImg :src="`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`" />
            </VAvatar>
            
            <div class="flex-grow-1">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-h6">{{ user.name }}</div>
                  <div class="text-subtitle-2 text-medium-emphasis">
                    {{ user.email }}
                  </div>
                </div>
                <div class="d-flex align-center">
                  <VChip
                    v-for="role in user.roles"
                    :key="role"
                    color="primary"
                    size="small"
                    class="me-2"
                    variant="tonal"
                  >
                    {{ role }}
                  </VChip>
                  <VBtn
                    icon
                    variant="text"
                    color="info"
                    class="me-2"
                    @click="handleEditUser(user)"
                  >
                    <VIcon :icon="userActionTypes.edit.icon" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="error"
                    @click="handleDeleteUser(user)"
                  >
                    <VIcon :icon="userActionTypes.delete.icon" />
                  </VBtn>
                </div>
              </div>
            </div>
          </div>
        </VCard>

        <!-- Pagination -->
        <div class="d-flex justify-center mt-6">
          <VPagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            @update:model-value="fetchUsers"
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
        No users found matching your criteria.
      </VAlert>
    </VCardText>

    <!-- Form Dialog -->
    <VDialog
      v-model="formDialog"
      max-width="600px"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-6">
          <div class="d-flex align-center">
            <VIcon
              :icon="userActionTypes[formMode].icon"
              :color="userActionTypes[formMode].color"
              size="large"
              class="me-3"
            />
            {{ formMode === 'create' ? 'Create New User' : 'Edit User' }}
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VForm @submit.prevent="handleFormSubmit">
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

              <VCol cols="12">
                <VTextField
                  v-model="formData.password_confirmation"
                  label="Confirm Password"
                  type="password"
                />
              </VCol>

              <VCol cols="12">
                <VSelect
                  v-model="formData.roles"
                  :items="roles"
                  item-title="name"
                  item-value="name"
                  label="Roles"
                  multiple
                  chips
                  closable-chips
                  :error-messages="formErrors.roles"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="formDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            :color="userActionTypes[formMode].color"
            :loading="formLoading"
            @click="handleFormSubmit"
          >
            <VIcon
              start
              :icon="userActionTypes[formMode].icon"
            />
            {{ formMode === 'create' ? 'Create User' : 'Save Changes' }}
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
        <VCardTitle class="pa-6">
          <div class="d-flex align-center">
            <VIcon
              :icon="userActionTypes.delete.icon"
              color="error"
              size="large"
              class="me-3"
            />
            Delete User
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert
            v-if="deleteError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ deleteError }}
          </VAlert>

          <p class="text-body-1">
            Are you sure you want to delete the user "{{ currentUser?.name }}"?
            This action cannot be undone.
          </p>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="deleteLoading"
            @click="handleDeleteConfirm"
          >
            <VIcon
              start
              :icon="userActionTypes.delete.icon"
            />
            Delete User
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
.user-management-card {
  overflow: hidden;
  border-radius: 12px;
}

.search-field {
  max-inline-size: 250px;
}

.role-select {
  max-inline-size: 150px;
}

.user-card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 10%) !important;
  transform: translateX(4px);
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
