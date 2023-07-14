<script setup>
const { params } = useRoute()
const id = params.list
const { data, pending } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).find())
const hasData = data.value && Array.isArray(data.value) && data.value.length
if (!hasData)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>

<template>
  <div class="m-10">
    <h1 class="h2 text-left capitalize">
      {{ id }}'s List
    </h1>
    <div v-if="pending">
      Loading ...
    </div>
    <ArmyList v-else-if="hasData" :data="data" />
</div>
</template>
