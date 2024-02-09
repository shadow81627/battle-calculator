<template>
  <FancyScribeRoster :roster="data" :style="{
    '--primary-color': primaryColor,
    '--primary-color-transparent': primaryColor + '60'
  }" class="bg-light text-dark"></FancyScribeRoster>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
const { data } = useFetch('/api/battlescribe/fancyscribe', { transform: (data) => data.data })
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
