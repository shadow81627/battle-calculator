<script setup>
defineProps({
  rolls: { type: Array },
})
function occurrences(list) {
  return list.sort().reduce((acc, curr) => {
    acc[curr] ? ++acc[curr] : acc[curr] = 1
    return acc
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })
}
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
          v-for="(value, index) of Object.values(occurrences(rolls))"
          :key="index"
          class="px-1 text-right font-mono"
          v-html="String(value).padStart(2, '&nbsp;')"
        />
      </tr>
    </tbody>
  </table>
</template>
