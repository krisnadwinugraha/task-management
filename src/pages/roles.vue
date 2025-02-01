<script setup>
import { computed, onMounted } from 'vue'
import { useRolesStore } from '../stores/roles'

const rolesStore = useRolesStore()

// Computed properties from store
const roles = computed(() => rolesStore.roles)
const loading = computed(() => rolesStore.loading)
const error = computed(() => rolesStore.error)
const permissions = computed(() => rolesStore.permissions)

// For pagination
const currentPage = computed({
  get: () => rolesStore.pagination.currentPage,
  set: (value) => rolesStore.pagination = { ...rolesStore.pagination, currentPage: value }
})
const totalPages = computed(() => rolesStore.pagination.totalPages)

// Table headers
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Methods
const fetchRoles = (page = 1) => {
  rolesStore.fetchRoles(page)
}

const handleCreateRole = async () => {
  rolesStore.formMode = 'create'
  rolesStore.formData = {
    name: '',
    permissions: []
  }
  rolesStore.formDialog = true
  await rolesStore.fetchPermissions()
}

const handleEditRole = async (role) => {
  rolesStore.formMode = 'edit'
  rolesStore.currentRole = role
  rolesStore.formData = {
    ...role,
    permissions: [...role.permissions] // Create a new array with the permission names
  }
  rolesStore.formDialog = true
  await rolesStore.fetchPermissions()
}

const handleDeleteRole = (role) => {
  rolesStore.currentRole = role
  rolesStore.deleteDialog = true
}

const handleDeleteConfirm = () => {
  rolesStore.deleteRole()
}

const handleFormSubmit = () => {
  // The form data is already in the correct format
  const formData = {
    name: rolesStore.formData.name,
    permissions: rolesStore.formData.permissions
  }
  
  if (rolesStore.formMode === 'create') {
    rolesStore.createRole(formData)
  } else {
    rolesStore.updateRole({
      id: rolesStore.currentRole.id,
      roleData: formData
    })
  }
}

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Updated helper function to check if permission is selected using name
const isPermissionSelected = (permissionName) => {
  return rolesStore.formData.permissions.includes(permissionName)
}

// Updated helper function to handle permission toggle using name
const togglePermission = (permissionName) => {
  const permissions = rolesStore.formData.permissions
  const index = permissions.indexOf(permissionName)
  
  if (index === -1) {
    permissions.push(permissionName)
  } else {
    permissions.splice(index, 1)
  }
  
  rolesStore.formData.permissions = [...permissions]
}

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <div>
    <VCard class="elevation-2">
      <VCardTitle class="d-flex justify-space-between align-center">
        <h5 class="text-h5">
          Roles List
        </h5>
        <div>
          <VBtn
            color="primary"
            class="me-2"
            @click="handleCreateRole"
          >
            <VIcon
              start
              icon="ri-add-line"
            />
            New Role
          </VBtn>
          <VBtn
            color="secondary"
            @click="() => fetchRoles(currentPage)"
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
              v-for="role in roles"
              :key="role.id"
            >
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td>{{ formatDate(role.created_at) }}</td>
              <td>
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  color="primary"
                  class="me-1"
                  @click="handleEditRole(role)"
                >
                  <VIcon icon="ri-edit-line" />
                </VBtn>
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  color="error"
                  @click="handleDeleteRole(role)"
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
            @update:model-value="fetchRoles"
          />
        </div>
      </VCardText>
    </VCard>

    <!-- Form Dialog -->
    <VDialog
    v-model="rolesStore.formDialog"
    max-width="600px"
    persistent
  >
    <VCard>
      <VCardTitle>
        {{ rolesStore.formMode === 'create' ? 'Create New Role' : 'Edit Role' }}
      </VCardTitle>

      <VCardText>
        <VForm @submit.prevent="handleFormSubmit">
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="rolesStore.formData.name"
                  label="Name"
                  required
                  :error-messages="rolesStore.formErrors.name"
                />
              </VCol>

              <VCol cols="12">
                <div>
                  <strong>Permissions:</strong>
                  <VRow>
                    <VCol cols="6" v-for="permission in permissions" :key="permission.id">
                      <VCheckbox
                        :model-value="isPermissionSelected(permission.name)"
                        @update:model-value="togglePermission(permission.name)"
                        :label="permission.name"
                      />
                    </VCol>
                  </VRow>
                </div>
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
          @click="rolesStore.formDialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          :loading="rolesStore.formLoading"
          @click="handleFormSubmit"
        >
          {{ rolesStore.formMode === 'create' ? 'Create' : 'Save' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

    <!-- Delete Dialog -->
    <VDialog
      v-model="rolesStore.deleteDialog"
      max-width="500px"
    >
      <VCard>
        <VCardTitle class="text-h5">
          Delete Role
        </VCardTitle>

        <VCardText>
          <VAlert
            v-if="rolesStore.deleteError"
            type="error"
            class="mb-4"
          >
            {{ rolesStore.deleteError }}
          </VAlert>

          Are you sure you want to delete the role "{{ rolesStore.currentRole?.name }}"?
          This action cannot be undone.
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="grey-darken-1"
            variant="text"
            @click="rolesStore.deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="rolesStore.deleteLoading"
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
