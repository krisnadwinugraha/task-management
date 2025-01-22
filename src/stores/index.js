// router/index.js
import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
})

// Navigation guard
router.beforeEach((to, from, next) => {
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
  })

export default router
