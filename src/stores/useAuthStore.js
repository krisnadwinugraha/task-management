// @/stores/useAuthStore.js
import axios from 'axios'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  
  actions: {
    async login(email, password, remember = true) { // Made remember default to true
      this.loading = true
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
        })
        
        this.user = response.data.user
        this.token = response.data.token
        
        // Always store auth data (changed from remember condition)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      // Clear state
      this.user = null
      this.token = null
      
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Clear axios header
      delete axios.defaults.headers.common['Authorization']
    },
    
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }
})
