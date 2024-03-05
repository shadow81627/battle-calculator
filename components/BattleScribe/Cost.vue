<script setup>
defineProps({
  cost: { type: Object, required: true },
});
</script>

<template>
  <span> {{ cost.value }}{{ cost.name }} </span>
</template>
