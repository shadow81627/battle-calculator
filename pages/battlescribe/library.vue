<script setup>
const { data, loading } = useFetch('/api/battlescribe/library')
</script>

<template>
  <span v-if="loading">Loading...</span>
  <span v-else-if="!data">No data found</span>
  <div v-else class="m-10">
    <BSAccordion :selections="data.data" />
  </div>
</template>
