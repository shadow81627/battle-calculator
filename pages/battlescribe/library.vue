<script setup>
const { data } = useFetch('/api/battlescribe/library')
</script>

<template>
  <div class="m-10">
    <BSAccordion :selections="data.data" />
  </div>
</template>
