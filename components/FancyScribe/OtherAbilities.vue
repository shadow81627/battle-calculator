<script setup>
const props = defineProps(['abilities'])
const keys = Object.keys(props.abilities)?.filter((key) => key !== "Abilities");
</script>

<template>
  <template v-for="key of keys">
    <thead>
      <tr style="background-color: var(--primary-color); color: #fff">
        <th></th>
        <th colspan="7" style="text-align: left;">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="([name, value]) of Object.entries(abilities[key])" :key="name">
        <td></td>
        <td colspan="7"
          style="font-size: 0.9em; line-height: 1.4; text-align: left; padding-top: 4px; padding-bottom: 4px">
          <span style="font-weight: 700">{{ name }}:</span> {{ value }}
        </td>
      </tr>
    </tbody>
  </template>
</template>
