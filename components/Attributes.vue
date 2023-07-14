<script setup lang="ts">
defineProps<{
  attributes: {
    movement: number,
    toughness: number,
    save: number,
    wound: number,
    leadership: number,
    control: number,
  }
}>()
</script>

<template>
  <div class="flex">
    <div v-for="[key, value] of Object.entries(attributes)" :key="`${key}-${value}`" class="pr-5">
      <div class="capitalize">{{ key }}</div>
      <div class="text-center font-barlow text-4xl font-700">{{ value }}</div>
    </div>
  </div>
</template>
