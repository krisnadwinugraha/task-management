<template>
  <div class="footer-container d-flex align-center justify-space-between text-medium-emphasis">
    <!-- Footer: left content -->
    <div class="d-flex align-center text-base">
      &copy; {{ new Date().getFullYear() }},
      <span class="ms-1">Task Management System</span>
    </div>
    <!-- Footer: right content -->
    <div class="d-flex gap-x-4">
      <a href="/privacy-policy" class="text-primary">Privacy Policy</a>
      <a href="/terms-of-service" class="text-primary">Terms of Service</a>
      <a href="/contact-us" class="text-primary">Contact Us</a>
    </div>
  </div>
</template>

<style scoped>
.footer-container {
  padding: 16px;
  background-color: var(--v-theme-surface);
  border-block-start: 1px solid var(--v-theme-border-subtle);
}
</style>
