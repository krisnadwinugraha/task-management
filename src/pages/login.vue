<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Use blank layout
definePage({ 
  meta: { 
    layout: 'blank'  // This ensures no nav/sidebar appears
  } 
})

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const isPasswordVisible = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.login(
      form.value.email,
      form.value.password
    )
    
    if (success) {
      successMessage.value = 'Login successful! Redirecting...'
      router.push('/')
    } else {
      errorMessage.value = 'Incorrect email or password. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <VCard
      flat
      :max-width="500"
      class="auth-card mt-12 mt-sm-0 pa-4"
    >
      <VCardText class="text-center pt-2">
        <RouterLink
          to="/"
          class="d-inline-block mb-8"
        >
          <div class="d-flex align-center justify-center">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
            <h1 class="text-h3 font-weight-bold ms-2 text-primary">
              {{ themeConfig.app.title }}
            </h1>
          </div>
        </RouterLink>

        <h4 class="text-h4 font-weight-bold mb-1">
          Welcome Back! 👋
        </h4>

        <p class="text-medium-emphasis mb-6">
          Please sign in to continue
        </p>

        <VAlert
          v-if="successMessage"
          density="comfortable"
          variant="tonal"
          color="success"
          class="mb-4"
        >
          {{ successMessage }}
        </VAlert>

        <VAlert
          v-if="errorMessage"
          density="comfortable"
          variant="tonal"
          color="error"
          class="mb-4"
        >
          {{ errorMessage }}
        </VAlert>

        <VForm @submit.prevent="handleLogin">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="johndoe@email.com"
                prepend-inner-icon="ri-mail-line"
                variant="outlined"
                :rules="[v => !!v || 'Email is required']"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                prepend-inner-icon="ri-lock-line"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                variant="outlined"
                :rules="[v => !!v || 'Password is required']"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                size="large"
                color="primary"
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                class="mt-4"
                style="min-block-size: 44px;"
              >
                Sign In
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.auth-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(var(--v-theme-surface));
  min-block-size: 100vh;
}

.auth-card {
  background: rgb(var(--v-theme-surface)) !important;
  inline-size: 100%;

  .v-field {
    border-radius: 8px;
  }

  .v-btn {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: none;
  }
}
</style>
