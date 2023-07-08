<script setup>
const { params } = useRoute()
const id = params.list
const { data } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).findOne())
</script>

<template>
  <h1 class="h2 text-left">
    {{ data.title }} List
  </h1>
  <ArmyList :data="data.body" />
</template>
