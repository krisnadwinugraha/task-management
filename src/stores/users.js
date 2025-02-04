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
    async fetchUsers(page = 1, search = '') {
      try {
        this.loading = true
        this.error = null
        
        const params = new URLSearchParams({
          page: page,
          per_page: this.pagination.itemsPerPage
        })
        
        if (search) {
          params.append('search', search)
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users?${params}`, {
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
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/users`,
          userData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )

        // Add the new user to the list if we're on the first page
        if (this.pagination.currentPage === 1) {
          this.users = [response.data.data, ...this.users].slice(0, this.pagination.itemsPerPage)
        }
        
        // Refresh the current page to get updated pagination
        await this.fetchUsers(this.pagination.currentPage)
        
        return response.data.data
      } catch (error) {
        this.error = `Error creating user: ${error.response?.data?.message || error.message}`
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(userId, userData) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          userData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )

        // Update the user in the current list
        const index = this.users.findIndex(user => user.id === userId)
        if (index !== -1) {
          this.users[index] = response.data.data
        }

        return response.data.data
      } catch (error) {
        this.error = `Error updating user: ${error.response?.data?.message || error.message}`
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(userId) {
      try {
        this.loading = true
        this.error = null

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json'
            }
          }
        )

        // Remove the user from the current list
        this.users = this.users.filter(user => user.id !== userId)
        
        // Refresh the current page to get updated pagination
        await this.fetchUsers(this.pagination.currentPage)

        return true
      } catch (error) {
        this.error = `Error deleting user: ${error.response?.data?.message || error.message}`
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUser(userId) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json'
            }
          }
        )

        return response.data.data
      } catch (error) {
        this.error = `Error fetching user: ${error.response?.data?.message || error.message}`
        throw error
      } finally {
        this.loading = false
      }
    },

    // Utility methods
    clearError() {
      this.error = null
    },

    resetState() {
      this.users = []
      this.loading = false
      this.error = null
      this.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    }
  }
})
