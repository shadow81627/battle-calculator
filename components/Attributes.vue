<script setup lang="ts">
import { pickBy } from 'lodash-es'
import type Unit from '~/types/unit'

const props = defineProps<{
  unit: Unit
}>()
const labels: { [key: string]: string } = {
  movement: 'M',
  toughness: 'T',
  save: 'SV',
  wound: 'W',
  leadership: 'LD',
  control: 'OC',
  pain: 'Feel no pain',
  modelPoints: 'Model Points',
  totalWounds: 'Total Wounds',
}
function sortAdditions(a: [string, number | undefined], b: [string, number | undefined]) {
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
    <div
      v-if="unit?.attributes"
      class="row"
    >
      <div
        v-for="[key, value] of Object.entries(unit?.attributes)"
        :key="`${key}-${value}`"
        class="col-6 lg:col-2 md:col-2 sm:col-4 pr-5 !print:w-auto"
      >
        <div class="text-center capitalize">
          {{ labels[key] ?? key }}
        </div>
        <div class="flex justify-center text-center text-dark font-barlow">
          <div
            class="bg-slate-600"
            style="padding: 2px; clip-path: polygon(12% 0px, 100% 0px, 100% 20%, 100% 88%, 88% 100%, 20% 100%, 0px 100%, 0px 12%);"
          >
            <div
              style="min-width: 3rem; min-height: 3rem; display: flex; align-items: center; justify-content: center; background: rgb(232, 237, 231); clip-path: polygon(10% 0px, 100% 0px, 100% 20%, 100% 90%, 90% 100%, 20% 100%, 0px 100%, 0px 10%); padding: 3px; font-size: 1.6em; font-weight: 800;"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="_additions && Object.entries(pickBy(_additions, Boolean)).length"
      class="row"
    >
      <div
        v-for="[key, value] of Object.entries(pickBy(_additions, Boolean)).sort(sortAdditions)"
        :key="`${key}-${value}`"
        class="col-6 lg:col-2 md:col-3 sm:col-4 flex flex-col pr-5 !print:w-auto"
      >
        <div class="flex flex-grow-1 items-center justify-center text-center capitalize">
          {{ labels[key] ?? key }}
        </div>
        <div class="text-center text-4xl font-700 font-barlow">
          {{ value }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="row"
    >
      <div class="col col-2 pr-5">
        <div class="text-center capitalize">
          &nbsp;
        </div>
        <div class="text-center text-4xl font-700 font-barlow">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
