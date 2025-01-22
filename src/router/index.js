// router/index.js
import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
})

router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    
    if (authRequired && !authStore.isAuthenticated) {
      return next('/login')
    }
    
    if (to.path === '/login' && authStore.isAuthenticated) {
      return next('/')
    }
    
    next()
  } catch (error) {
    console.error('Router guard error:', error)
    next('/login') // Fallback to login page if there's an error
  }
})

export default router
