import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'
import { router } from './1.router'

export default function () {
  // Initialize auth store
  const authStore = useAuthStore()
  
  // Set up axios default base URL
  axios.defaults.baseURL = 'http://127.0.0.1:8000'
  
  // Initialize auth state
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  
  // Add router guard
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    
    if (authRequired && !isAuthenticated) {
      return next('/login')
    }
    
    if (to.path === '/login' && isAuthenticated) {
      return next('/')
    }
    
    next()
  })
}
