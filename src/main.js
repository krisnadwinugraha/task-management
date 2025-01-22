import App from '@/App.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'
// import router from './router'
import { pinia } from './stores'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Create and use Pinia
app.use(pinia)
// app.use(router)
// Initialize auth state
const authStore = useAuthStore()
authStore.initializeAuth()

// Register other plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')

