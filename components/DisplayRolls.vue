<script setup lang="ts">
import occurrences from '~/utils/occurrences'

const props = defineProps<{
  rolls: number[],
  reverse?: boolean,
}>()
const entries = computed(() => {
  const entries = Object.entries(occurrences(props.rolls))
  if (props.reverse) {
    return entries.reverse()
  }
  return entries
})
</script>

<template>
  <table>
    <thead>
      <th v-for="[key] of entries" :key="key" class="px-1 text-right">
        {{ key }}
      </th>
    </thead>
    <tbody>
      <tr>
        <ClientOnly>
          <td v-for="[key, value] of entries" :key="`${key}-${value}`"
            class="px-1 text-right font-mono" v-html="String(value).padStart(2, '&nbsp;')" />
          <template #fallback>
            <td v-for="[key, value] of entries" :key="`${key}-${value}`"
              class="px-1 text-right font-mono" v-html="String(0).padStart(2, '&nbsp;')" />
          </template>
        </ClientOnly>
      </tr>
    </tbody>
  </table>
</template>
