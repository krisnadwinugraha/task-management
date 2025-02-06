import axios from 'axios'
import { computed, ref, watch } from 'vue'

export default function useActivityLog() {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedType = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)

  const activityTypes = {
    create: { icon: 'ri-add-circle-line', color: 'success' },
    update: { icon: 'ri-edit-2-line', color: 'info' },
    delete: { icon: 'ri-delete-bin-line', color: 'error' },
    default: { icon: 'ri-information-line', color: 'primary' }
  }

  const filteredActivities = computed(() => {
    const filtered = activities.value.filter(activity => {
      const matchesSearch = activity.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        activity.causer?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType = selectedType.value === 'all' || activity.type === selectedType.value
      return matchesSearch && matchesType
    })
    
    totalItems.value = filtered.length
    
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    
    return filtered.slice(start, end)
  })

  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

  const fetchActivities = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/activities')
      activities.value = response.data.activities
      currentPage.value = 1
    } catch (err) {
      error.value = 'Failed to load activities'
      console.error('Fetch activities error:', err)
    } finally {
      loading.value = false
    }
  }

  const getActivityTypeInfo = (activity) => {
    const type = activity.description.toLowerCase().includes('created') ? 'create' 
               : activity.description.toLowerCase().includes('updated') ? 'update'
               : activity.description.toLowerCase().includes('deleted') ? 'delete'
               : 'default'
    return activityTypes[type]
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    })
  }

  const handlePageChange = (page) => {
    currentPage.value = page
  }

  watch([searchQuery, selectedType], () => {
    currentPage.value = 1
  })

  return {
    activities,
    loading,
    error,
    searchQuery,
    selectedType,
    currentPage,
    itemsPerPage,
    totalItems,
    filteredActivities,
    totalPages,
    fetchActivities,
    getActivityTypeInfo,
    formatTimestamp,
    handlePageChange
  }
}
