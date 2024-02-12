<template>
  <span v-if="pending">Loading...</span>
  <span v-else-if="!data">No data found</span>
  <FancyScribeRoster v-else :roster="data" :style="{
    '--primary-color': primaryColor,
    '--primary-color-transparent': primaryColor + '60'
  }" class="bg-light text-dark"></FancyScribeRoster>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
const { data, pending } = useFetch('/api/battlescribe/fancyscribe', { transform: (data) => data.data })
const primaryColor = '#536766'
</script>

<style>
@page {
  margin: 0;
  size: A4 landscape;
}

.avoid-page-break {
  position: relative;
  page-break-inside: avoid;
  break-inside: avoid;
}
</style>
