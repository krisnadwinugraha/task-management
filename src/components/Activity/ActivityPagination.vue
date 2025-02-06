<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

const emits = defineEmits(['update:current-page'])
</script>

<template>
  <div class="d-flex justify-center align-center mt-6">
    <VPagination
      :model-value="currentPage"
      @update:model-value="$emit('update:current-page', $event)"
      :length="totalPages"
      :total-visible="7"
      rounded="circle"
    />
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.mt-6 {
  margin-block-start: 24px;
}
</style>
