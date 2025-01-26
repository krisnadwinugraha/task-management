// stores/users.js
import axios from 'axios'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    }
  }),

  actions: {
    async fetchUsers(page = 1) {
      try {
        this.loading = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.users = response.data.data
        this.pagination = {
          currentPage: response.data.meta.current_page,
          totalPages: response.data.meta.last_page,
          totalItems: response.data.meta.total,
          itemsPerPage: response.data.meta.per_page
        }
      } catch (error) {
        this.error = `Error fetching users: ${error.response?.data?.message || error.message}`
      } finally {
        this.loading = false
      }
    }
  }
})
