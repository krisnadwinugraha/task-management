<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRolesStore } from '../stores/roles'

const rolesStore = useRolesStore()

// Computed properties from store
const roles = computed(() => rolesStore.roles)
const loading = computed(() => rolesStore.loading)
const error = computed(() => rolesStore.error)
const permissions = computed(() => rolesStore.permissions)

// Search and filter
const searchQuery = ref('')
const selectedPermission = ref('all')

// For pagination
const currentPage = computed({
  get: () => rolesStore.pagination.currentPage,
  set: (value) => rolesStore.pagination = { ...rolesStore.pagination, currentPage: value }
})
const totalPages = computed(() => rolesStore.pagination.totalPages)

// Role action types with their corresponding icons and colors
const roleActionTypes = {
  create: { icon: 'ri-shield-user-line', color: 'success' },
  edit: { icon: 'ri-shield-keyhole-line', color: 'info' },
  delete: { icon: 'ri-shield-cross-line', color: 'error' }
}

// Filtered roles based on search and selected permission
const filteredRoles = computed(() => {
  return roles.value.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesPermission = selectedPermission.value === 'all' || 
      (role.permissions && role.permissions.includes(selectedPermission.value))
    return matchesSearch && matchesPermission
  })
})

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
    permissions: [...role.permissions]
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const isPermissionSelected = (permissionName) => {
  return rolesStore.formData.permissions.includes(permissionName)
}

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

// Load initial data
onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <VCard class="role-management-card">
    <VCardTitle class="d-flex justify-space-between align-center pa-6">
      <div class="d-flex align-center">
        <VIcon icon="ri-shield-star-line" size="large" class="me-3" />
        <h5 class="text-h5 font-weight-bold mb-0">Role Management</h5>
      </div>
      <div class="d-flex align-center">
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Search roles..."
          prepend-inner-icon="ri-search-line"
          class="search-field me-4"
          hide-details
        />
        <VSelect
          v-model="selectedPermission"
          :items="[
            { title: 'All Permissions', value: 'all' },
            ...permissions.map(permission => ({
              title: permission.name,
              value: permission.name
            }))
          ]"
          density="compact"
          class="permission-select me-4"
          hide-details
        />
        <VBtn
          color="success"
          class="me-2"
          elevation="1"
          @click="handleCreateRole"
        >
          <VIcon start :icon="roleActionTypes.create.icon" />
          New Role
        </VBtn>
        <VBtn
          color="primary"
          @click="() => fetchRoles(currentPage)"
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

      <!-- Roles List -->
      <div v-else-if="filteredRoles.length" class="roles-list">
        <VCard
          v-for="role in filteredRoles"
          :key="role.id"
          class="role-card mb-4"
          elevation="1"
        >
          <div class="d-flex align-center pa-4">
            <div class="role-icon me-4">
              <VIcon
                icon="ri-shield-star-line"
                size="32"
                color="primary"
              />
            </div>
            
            <div class="flex-grow-1">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="d-flex align-center">
                    <div class="text-h6">{{ role.name }}</div>
                    <div class="text-caption text-medium-emphasis ms-4">
                      Created {{ formatDate(role.created_at) }}
                    </div>
                  </div>
                  <div class="d-flex flex-wrap mt-2">
                    <VChip
                      v-for="permission in role.permissions"
                      :key="permission"
                      color="primary"
                      size="small"
                      class="me-2 mb-2"
                      variant="tonal"
                    >
                      {{ permission }}
                    </VChip>
                  </div>
                </div>
                <div class="d-flex align-center">
                  <VBtn
                    icon
                    variant="text"
                    color="info"
                    class="me-2"
                    @click="handleEditRole(role)"
                  >
                    <VIcon :icon="roleActionTypes.edit.icon" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="error"
                    @click="handleDeleteRole(role)"
                  >
                    <VIcon :icon="roleActionTypes.delete.icon" />
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
            @update:model-value="fetchRoles"
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
        No roles found matching your criteria.
      </VAlert>
    </VCardText>

    <!-- Form Dialog -->
    <VDialog
      v-model="rolesStore.formDialog"
      max-width="600px"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-6">
          <div class="d-flex align-center">
            <VIcon
              :icon="roleActionTypes[rolesStore.formMode].icon"
              :color="roleActionTypes[rolesStore.formMode].color"
              size="large"
              class="me-3"
            />
            {{ rolesStore.formMode === 'create' ? 'Create New Role' : 'Edit Role' }}
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VForm @submit.prevent="handleFormSubmit">
            <VTextField
              v-model="rolesStore.formData.name"
              label="Role Name"
              required
              class="mb-4"
              :error-messages="rolesStore.formErrors.name"
            />

            <div class="permissions-section">
              <div class="text-h6 mb-4">Permissions</div>
              <VRow>
                <VCol
                  v-for="permission in permissions"
                  :key="permission.id"
                  cols="12"
                  sm="6"
                >
                  <VCheckbox
                    :model-value="isPermissionSelected(permission.name)"
                    @update:model-value="togglePermission(permission.name)"
                    :label="permission.name"
                    color="primary"
                    density="comfortable"
                  />
                </VCol>
              </VRow>
            </div>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="rolesStore.formDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            :color="roleActionTypes[rolesStore.formMode].color"
            :loading="rolesStore.formLoading"
            @click="handleFormSubmit"
          >
            <VIcon
              start
              :icon="roleActionTypes[rolesStore.formMode].icon"
            />
            {{ rolesStore.formMode === 'create' ? 'Create Role' : 'Save Changes' }}
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
        <VCardTitle class="pa-6">
          <div class="d-flex align-center">
            <VIcon
              :icon="roleActionTypes.delete.icon"
              color="error"
              size="large"
              class="me-3"
            />
            Delete Role
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert
            v-if="rolesStore.deleteError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ rolesStore.deleteError }}
          </VAlert>

          <p class="text-body-1">
            Are you sure you want to delete the role "{{ rolesStore.currentRole?.name }}"?
            This action cannot be undone.
          </p>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="rolesStore.deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="rolesStore.deleteLoading"
            @click="handleDeleteConfirm"
          >
            <VIcon
              start
              :icon="roleActionTypes.delete.icon"
            />
            Delete Role
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
.role-management-card {
  overflow: hidden;
  border-radius: 12px;
}

.search-field {
  max-inline-size: 250px;
}

.permission-select {
  max-inline-size: 200px;
}

.role-card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.role-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 10%) !important;
  transform: translateX(4px);
}

.permissions-section {
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-block-start: 16px;
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
