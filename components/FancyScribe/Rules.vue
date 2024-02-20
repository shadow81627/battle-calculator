<script setup>
const props = defineProps(['rules'])
const keys = Object.keys(props.rules)
</script>

<template>
  <div
    v-if="keys && keys.length"
    style="padding: 5px 2px; gap: 3px; border-bottom: 1px dotted rgb(158, 159, 161); line-height: 1.3; display: flex; flex-wrap: wrap;"
  >
    <span style="font-size: 0.8em;">RULES: </span>
    <span v-for="(rule, index) of keys" :key="rule" style="white-space: nowrap; font-size: 0.8em; font-weight: 700;">
      {{ rule }}{{ index < keys.length - 1 ? ", " : "" }} </span>
  </div>
</template>
