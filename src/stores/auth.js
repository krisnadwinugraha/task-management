// stores/auth.js
import axios from 'axios';
import { defineStore } from 'pinia';

const API_URL = import.meta.env.VITE_API_URL;
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        })
        
        this.user = response.data.user
        this.token = response.data.token
        
        // Set token in axios headers for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
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
