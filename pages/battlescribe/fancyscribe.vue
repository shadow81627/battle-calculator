<template>
  <FancyScribeRoster :roster="data" :style="{
    '--primary-color': primaryColor,
    '--primary-color-transparent': primaryColor + '60'
  }" class="bg-light text-dark"></FancyScribeRoster>
</template>

<script setup>
const { data } = useFetch('/api/battlescribe/fancyscribe', { transform: (data) => data.data })
const primaryColor = '#536766'
</script>
