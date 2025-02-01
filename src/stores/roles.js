// stores/roles.js
import axios from 'axios'
import { defineStore } from 'pinia'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [],
    permissions: [],
    currentRole: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    },
    formDialog: false,
    deleteDialog: false,
    formMode: 'create',
    formLoading: false,
    formErrors: {},
    deleteError: null,
    deleteLoading: false,
    formData: {
      name: '',
      permissions: []
    }
  }),

  actions: {
    async fetchRoles(page = 1) {
      try {
        this.loading = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.roles = response.data.data
        this.pagination = {
          currentPage: response.data.meta.current_page,
          totalPages: response.data.meta.last_page,
          totalItems: response.data.meta.total,
          itemsPerPage: response.data.meta.per_page
        }
      } catch (error) {
        this.error = `Error fetching roles: ${error.response?.data?.message || error.message}`
      } finally {
        this.loading = false
      }
    },

    async fetchPermissions() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/permissions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.permissions = response.data
      } catch (error) {
        this.error = `Error fetching permissions: ${error.response?.data?.message || error.message}`
      }
    },

    async createRole(roleData) {
      try {
        this.formLoading = true
        await axios.post(`${import.meta.env.VITE_API_URL}/roles`, roleData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.formDialog = false
        await this.fetchRoles(this.pagination.currentPage)
      } catch (error) {
        if (error.response?.data?.errors) {
          this.formErrors = error.response.data.errors
        }
      } finally {
        this.formLoading = false
      }
    },

    async updateRole({ id, roleData }) {
      try {
        this.formLoading = true
        await axios.put(`${import.meta.env.VITE_API_URL}/roles/${id}`, roleData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.formDialog = false
        await this.fetchRoles(this.pagination.currentPage)
      } catch (error) {
        if (error.response?.data?.errors) {
          this.formErrors = error.response.data.errors
        }
      } finally {
        this.formLoading = false
      }
    },
    
    async deleteRole() {
      try {
        this.deleteLoading = true
        await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${this.currentRole.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.deleteDialog = false
        await this.fetchRoles(this.pagination.currentPage)
      } catch (error) {
        this.deleteError = `Error deleting role: ${error.response?.data?.message || error.message}`
      } finally {
        this.deleteLoading = false
      }
    }
  }
})
