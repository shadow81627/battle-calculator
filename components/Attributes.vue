<script setup lang="ts">
import {pickBy, isNumber} from 'lodash-es'
defineProps<{
  attributes?: {
    movement: number,
    toughness: number,
    save: number,
    wound: number,
    leadership: number,
    control: number,
  },
  additions?: {
    points?: number,
    pain?: number,
    invulnerable?: number,
  }
}>()
const labels: { [key: string]: string } = {
  movement: 'M',
  toughness: 'T',
  pain: 'Feel no pain'
}
function sortAdditions(a: [string, number], b: [string, number]) {
  const _a = labels[a[0]] ?? a[0]
  const _b = labels[b[0]] ?? b[0]
  if (a[0] === 'points' || (a[0] === 'invulnerable' && b[0] === 'pain')) return -1
  if (b[0] === 'points' || (b[0] === 'invulnerable' && a[0] === 'pain')) return 1
  return  _a.localeCompare(_b)
}
</script>

<template>
  <div class="container">
    <div class="row" v-if="attributes">
      <div v-for="[key, value] of Object.entries(attributes)" :key="`${key}-${value}`" class="pr-5 col col-2">
        <div class="text-center capitalize">{{ key }}</div>
        <div class="text-center font-barlow text-4xl font-700">{{ value }}</div>
      </div>
    </div>
    <div class="row" v-if="additions && Object.entries(pickBy(additions, Boolean)).length">
      <div v-for="[key, value] of Object.entries(pickBy(additions, Boolean)).sort(sortAdditions)" :key="`${key}-${value}`" class="pr-5 col col-2">
        <div class="text-center capitalize">{{ labels[key] ?? key }}</div>
        <div class="text-center font-barlow text-4xl font-700">{{ value }}</div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="pr-5 col col-2">
        <div class="text-center capitalize">&nbsp;</div>
        <div class="text-center font-barlow text-4xl font-700">&nbsp;</div>
      </div>
    </div>
  </div>
</template>
