<script setup>
const props = defineProps({ abilities: { type: Array, required: true } });
const keys = Object.keys(props.abilities);
</script>

<template>
  <div
    v-if="abilities"
    style="
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 4px 2px;
      border-bottom: 1px dotted rgb(158, 159, 161);
    "
  >
    <div
      v-for="ability of keys"
      :key="ability"
      style="font-size: 0.8em; line-height: 1.4"
    >
      <span style="font-weight: 700">{{ ability }}:</span>{{ " " }}
      {{ abilities[ability] }}
    </div>
  </div>
</template>
