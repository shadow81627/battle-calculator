<script setup>
const { params } = useRoute()
const id = params.list
const { data, pending } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).find())
</script>

<template>
  <h1 class="h2 text-left capitalize">
    {{ id }} List
  </h1>
  <div v-if="pending">
    Loading ...
  </div>
  <ArmyList v-else-if="data && Array.isArray(data)" :data="data" />
</template>
