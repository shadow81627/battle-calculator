<script setup>
const { params } = useRoute()
const id = params.list
const { data } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).find())
</script>

<template>
  <h1 class="h2 text-left capitalize">
    {{ id }} List
  </h1>
  <ArmyList :data="data" />
</template>
