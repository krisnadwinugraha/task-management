<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  searchQuery: String,
  selectedType: String,
  loading: Boolean
})

const emits = defineEmits(['update:search-query', 'update:selected-type', 'refresh'])
</script>

<template>
  <div class="d-flex align-center">
    <VTextField
      :model-value="searchQuery"
      @update:model-value="$emit('update:search-query', $event)"
      density="compact"
      placeholder="Search activities..."
      prepend-inner-icon="ri-search-line"
      class="search-field me-4"
      hide-details
    />
    <VSelect
      :model-value="selectedType"
      @update:model-value="$emit('update:selected-type', $event)"
      :items="[
        { title: 'All Activities', value: 'all' },
        { title: 'Created', value: 'create' },
        { title: 'Updated', value: 'update' },
        { title: 'Deleted', value: 'delete' }
      ]"
      density="compact"
      class="type-select me-4"
      hide-details
    />
    <VBtn
      color="primary"
      @click="$emit('refresh')"
      :loading="loading"
      elevation="1"
    >
      <VIcon start icon="ri-refresh-line" />
      Refresh
    </VBtn>
  </div>
</template>

<style scoped>
.search-field {
  max-inline-size: 250px;
}

.type-select {
  max-inline-size: 150px;
}
</style>
