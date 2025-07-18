<script setup>
defineProps({ abilities: { type: Object, required: true } });
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
      v-for="[key, value] of Object.entries(abilities)"
      :key="key"
      style="font-size: 0.8em; line-height: 1.4"
    >
      <span style="font-weight: 700">{{ key }}:</span>{{ " " }}
      {{ value.replaceAll("^^**", "").replaceAll("**^^", "") }}
    </div>
  </div>
</template>
