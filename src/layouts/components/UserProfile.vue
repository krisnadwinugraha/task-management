<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Get user data from the store
const user = authStore.getUser

// Compute initials from user name
const userInitials = computed(() => {
  if (!user.name) return 'U'
  return user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})


const handleLogout = async () => {
  try { 
    await authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Generate random background color for avatar
const avatarColor = computed(() => {
  const colors = [
    'primary', 'success', 'warning', 'error', 'info'
  ]
  const hash = user.name?.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0) || 0
  return colors[hash % colors.length]
})
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    class="user-profile-badge"
  >
    <VAvatar
      :color="avatarColor"
      class="cursor-pointer"
      size="38"
    >
      <span class="text-white text-h6">{{ userInitials }}</span>

      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="15px"
        transition="scroll-y-transition"
      >
        <VCard>
          <VList>
            <!-- User Info Header -->
            <VListItem class="px-4 py-3">
              <template #prepend>
                <VAvatar :color="avatarColor" size="40">
                  <span class="text-white">{{ userInitials }}</span>
                </VAvatar>
              </template>

              <VListItemTitle class="font-weight-medium text-h6">
                {{ user.name }}
              </VListItemTitle>
              <VListItemSubtitle class="text-caption">
                {{ user.email }}
              </VListItemSubtitle>
            </VListItem>

            <VDivider class="my-2" />

            <!-- Logout Button -->
            <VListItem class="px-4 py-2">
              <VBtn
                block
                color="error"
                variant="tonal"
                prepend-icon="ri-logout-box-r-line"
                @click="handleLogout"
              >
                Logout
              </VBtn>
            </VListItem>
          </VList>
        </VCard>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>

<style lang="scss" scoped>
.user-profile-badge {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.v-badge--bordered.v-badge--dot .v-badge__badge::after) {
    border-color: rgb(var(--v-theme-background));
  }
}
</style>
