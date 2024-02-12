<script setup>
import { groupBy, startCase } from 'lodash-es'

const route = useRoute()
const router = useRouter()
const turns = ref(1)
const distance = ref(24)
const { data: unitOptions } = await useAsyncData('lists', () => queryContent('lists').find(), {
  transform(data) {
    const options = data.map(item => ({ value: item._path, label: item.name }))
    return options
  },
})
const groupedUnitOptions = computed(() => {
  const grouped = groupBy(unitOptions.value, (option) => {
    return startCase(option.value.split('/').slice(-2, -1))
  })
  return Object.entries(grouped)
})
const attackerId = computed({
  get() {
    const id = decodeURIComponent(route.query.attackerId)
    if (unitOptions.value.find(option => option.value === id))
      return id
    return '/lists/damien-infantry-artillery/scout-sentinels'
  },
  set(value) {
    router.replace({ query: { ...route.query, attackerId: encodeURIComponent(value) } })
  },
})
const defenderId = computed({
  get() {
    const id = decodeURIComponent(route.query.defenderId)
    if (unitOptions.value.find(option => option.value === id))
      return id
    return '/lists/braydon-thousand-sons/mutalith-vortex-beast'
  },
  set(value) {
    router.replace({ query: { ...route.query, defenderId: encodeURIComponent(value) } })
  },
})
const { data: attacker, refresh: refreshAttacker, loadingAttacker } = await useAsyncData(attackerId.value, () => queryContent(attackerId.value).findOne())
const { data: defender, refresh: refreshDefender, loadingDefender } = await useAsyncData(defenderId.value, () => queryContent(defenderId.value).findOne())
</script>

<template>
  <section class="container">
    <h1 class="text-left h1">
      MathHammer
    </h1>
    <div>
      <p>Determine the expected outcome of dice when units attack in games like Warhammer 40,000 (10th Edition).</p>

      <p>This practice is often referred to as "MathHammer" and is commonly used to help make optimum unit selections as
        well as improve overall strategic decisions.</p>
    </div>
  </section>

  <section class="container my-9">
    <div class="row">
      <div class="col">
        <table class="text-left">
          <thead>
            <tr>
              <th class="p-1">
                <label class="font-bold">Turns</label>
              </th>
              <th class="p-1">
                <label class="font-bold">Distance</label>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-1">
                <input v-model="turns" name="turns" class="max-w-250px input" type="number" max="5" min="1">
              </td>
              <td class="p-1">
                <input v-model="distance" name="distance" class="max-w-250px input" type="number" min="1">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section v-if="loadingAttacker || loadingDefender" class="container my-6">Loading...</section>
  <section v-else class="container my-6">
    <div class="row">
      <div class="col md:col-6">
        <div class="text-left">
          <h2 class="h2">
            Attacker
            <select v-model="attackerId" class="inline w-250px select" name="attacker" @change="refreshAttacker">
              <optgroup v-for="[key, group] of groupedUnitOptions" :key="key"
                :label="key === 'Lists' ? 'Unassigned' : key">
                <option v-for="option of group" :key="option.value" :value="option.value"
                  :selected="attackerId === option.value ? option.value : undefined">
                  {{ option.label }}
                </option>
              </optgroup>
            </select>
          </h2>
        </div>
        <UnitCombat v-if="attacker && defender" :unit="attacker" :target="defender" v-bind="{ turns, distance }" />
      </div>
      <div class="col md:col-6">
        <div class="text-left">
          <h2 class="h2">
            Defender
            <select v-model="defenderId" class="inline w-250px select" name="defender" @change="refreshDefender">
              <optgroup v-for="[key, group] of groupedUnitOptions" :key="key"
                :label="key === 'Lists' ? 'Unassigned' : key">
                <option v-for="option of group" :key="option.value" :value="option.value"
                  :selected="defenderId === option.value ? option.value : undefined">
                  {{ option.label }}
                </option>
              </optgroup>
            </select>
          </h2>
        </div>
        <UnitCombat v-if="defender && attacker" :unit="defender" :target="attacker" v-bind="{ turns, distance }" />
      </div>
    </div>
  </section>
</template>
