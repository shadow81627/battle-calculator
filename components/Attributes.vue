<script setup lang="ts">
import { pickBy } from 'lodash-es'
import type Unit from '~/types/unit'

const props = defineProps<{
  unit: Unit
}>()
const labels: { [key: string]: string } = {
  movement: 'M',
  toughness: 'T',
  pain: 'Feel no pain',
  modelPoints: 'Model Points',
  totalWounds: 'Total Wounds',
}
function sortAdditions(a: [string, number], b: [string, number]) {
  const _a = labels[a[0]] ?? a[0]
  const _b = labels[b[0]] ?? b[0]
  if (a[0] === 'points' || (a[0] === 'invulnerable' && b[0] === 'pain'))
    return -1
  if (b[0] === 'points' || (b[0] === 'invulnerable' && a[0] === 'pain'))
    return 1
  return _a.localeCompare(_b)
}
const modelPoints = computed(() => {
  if (props.unit?.models && props.unit?.models > 1 && props.unit?.points)
    return Math.round(props.unit?.points / props.unit?.models)
})
const totalWounds = computed(() => {
  if (props.unit?.models && props.unit?.models > 1)
    return props.unit.attributes.wound * props.unit?.models
})
const _additions = computed(() => {
  const _additions = {
    modelPoints: modelPoints.value,
    models: props.unit?.models,
    points: props.unit?.points,
    invulnerable: getAbilityValue(props.unit, 'INVULNERABLE SAVE'),
    pain: getAbilityValue(props.unit, 'Feel No Pain'),
    totalWounds: totalWounds.value,
  }
  return _additions
})
</script>

<template>
  <div class="container">
    <div v-if="unit?.attributes" class="row">
      <div
        v-for="[key, value] of Object.entries(unit?.attributes)" :key="`${key}-${value}`"
        class="col-6 lg:col-2 md:col-3 sm:col-4 pr-5 !print:w-auto"
      >
        <div class="text-center capitalize">
          {{ key }}
        </div>
        <div class="text-center font-barlow text-4xl font-700">
          {{ value }}
        </div>
      </div>
    </div>
    <div v-if="_additions && Object.entries(pickBy(_additions, Boolean)).length" class="row">
      <div
        v-for="[key, value] of Object.entries(pickBy(_additions, Boolean)).sort(sortAdditions)"
        :key="`${key}-${value}`" class="col-6 lg:col-2 md:col-3 sm:col-4 pr-5 !print:w-auto"
      >
        <div class="text-center capitalize">
          {{ labels[key] ?? key }}
        </div>
        <div class="text-center font-barlow text-4xl font-700">
          {{ value }}
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col col-2 pr-5">
        <div class="text-center capitalize">
          &nbsp;
        </div>
        <div class="text-center font-barlow text-4xl font-700">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
