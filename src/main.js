import App from '@/App.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { registerPlugins } from '@core/utils/plugins'
import 'chartkick/chart.js'
import { createApp } from 'vue'
import VueChartkick from 'vue-chartkick'
import { pinia } from './stores'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Create and use Pinia
app.use(pinia)
app.use(VueChartkick)
// Initialize auth state
const authStore = useAuthStore()
authStore.initializeAuth()

// Register other plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')

