<script setup>
import occurrences from '~/utils/occurrences'

defineProps({
  rolls: { type: Array },
})
</script>

<template>
  <table>
    <thead>
      <th
        v-for="key of Object.keys(occurrences(rolls))"
        :key="key"
        class="px-1 text-right"
      >
        {{ key }}
      </th>
    </thead>
    <tbody>
      <tr>
        <td
          v-for="[key, value] of Object.entries(occurrences(rolls))"
          :key="`${key}-${value}`"
          class="px-1 text-right font-mono"
          v-html="String(value).padStart(2, '&nbsp;')"
        />
      </tr>
    </tbody>
  </table>
</template>
