<script setup>
const props = defineProps(['abilities'])
const keys = Object.keys(props.abilities)?.filter(key => key !== 'Abilities')
</script>

<template>
  <div v-for="key of keys" :key="key">
    <div style="background-color: var(--primary-color); color: #fff; font-weight: 600; min-height: 27px; font-size: 1.1em; padding: 1px 6px;" class="uppercase">
      {{ key }}
    </div>
    <div
      v-if="abilities"
      style="display: flex; flex-direction: column; gap: 8px; padding: 4px 2px; border-bottom: 1px dotted rgb(158, 159, 161);"
    >
      <div v-for="([name, value]) of Object.entries(abilities[key])" :key="name" style="font-size: 0.8em; line-height: 1.4;">
        <span style="font-weight: 700;">{{ name }}:</span>{{ " " }}
        {{ value }}
      </div>
    </div>
  </div>
</template>
