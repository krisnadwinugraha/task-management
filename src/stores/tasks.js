// stores/tasks.js
import axios from 'axios'
import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
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
    deleteLoading: false
  }),

  actions: {
    async fetchTasks(page = 1) {
      try {
        this.loading = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.tasks = response.data.data
        this.pagination = {
          currentPage: response.data.meta.current_page,
          totalPages: response.data.meta.last_page,
          totalItems: response.data.meta.total,
          itemsPerPage: response.data.meta.per_page
        }
      } catch (error) {
        this.error = `Error fetching tasks: ${error.response?.data?.message || error.message}`
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      try {
        this.formLoading = true
        await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, taskData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.formDialog = false
        await this.fetchTasks(this.pagination.currentPage)
      } catch (error) {
        if (error.response?.data?.errors) {
          this.formErrors = error.response.data.errors
        }
      } finally {
        this.formLoading = false
      }
    },

    async updateTask({ id, taskData }) {
      try {
        const plainTaskData = JSON.parse(JSON.stringify(taskData))
        console.log('Plain task data:', plainTaskData)
        this.formLoading = true
        await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${id}`, plainTaskData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.formDialog = false
        await this.fetchTasks(this.pagination.currentPage)
      } catch (error) {
        if (error.response?.data?.errors) {
          this.formErrors = error.response.data.errors
        }
        console.error('Update task error:', error)
      } finally {
        this.formLoading = false
      }
    },
    
    async deleteTask() {
      try {
        this.deleteLoading = true
        await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${this.currentTask.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        this.deleteDialog = false
        await this.fetchTasks(this.pagination.currentPage)
      } catch (error) {
        this.deleteError = `Error deleting task: ${error.response?.data?.message || error.message}`
      } finally {
        this.deleteLoading = false
      }
    }
  }
})
