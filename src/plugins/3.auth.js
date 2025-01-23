import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { router } from './1.router';

const API_URL = import.meta.env.VITE_API_URL; // Access environment variable for API URL

export default function () {
  // Initialize auth store - not used currently but might be needed later
  useAuthStore()
  
  // Set up axios default base URL using the environment variable
  axios.defaults.baseURL = API_URL // Use the environment variable

  // Initialize auth state
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Add axios interceptor for handling auth errors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )
  
  // Add router guard
  router.beforeEach((to, _from, next) => {
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
