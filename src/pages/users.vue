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

// Table headers
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

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
  } catch (error) {
    deleteError.value = error.response?.data?.message || 'Error deleting user'
  } finally {
    deleteLoading.value = false
  }
}

// Load initial data
onMounted(async () => {
  await rolesStore.fetchRoles() // Load roles for the select input
  fetchUsers()
})
</script>

<template>
  <div>
    <VCard class="elevation-2">
      <!-- Card title and buttons remain the same -->
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
              <td>
                <VChip
                  v-for="role in user.roles"
                  :key="role"
                  size="small"
                  class="me-1"
                  color="primary"
                >
                  {{ role }}
                </VChip>
              </td>
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

    <!-- Delete Dialog remains the same -->
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
