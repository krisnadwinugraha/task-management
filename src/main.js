import App from '@/App.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { registerPlugins } from '@core/utils/plugins'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize auth state
const authStore = useAuthStore()
authStore.initializeAuth()

// Register other plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
