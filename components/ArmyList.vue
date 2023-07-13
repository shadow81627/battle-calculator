<script setup lang="ts">
import { minBy, sumBy } from 'lodash-es'
interface Enhancement {
  name: string
  points: number
}
interface WeaponModifier {
  name: string
}
interface Weapon {
  name: string
  modifiers: WeaponModifier
  models: number
  range: number | "Melee"
  attack: number | string
  accuracy: number
  strength: number
  piercing: number
  damage: number | string,
  profiles?: Weapon[]
}
interface Unit {
  name: string
  models: number
  points: number
  quantity?: number
  offers: [
    {
      price: number
      priceCurrency: 'AUD' | 'USD'
      eligibleQuantity: number
      offeredBy: {
        type: 'Organization' | 'Person'
        name: string
      }
      itemCondition: 'NewCondition'
    },
  ],
  weapons?: Weapon[],
  enhancements?: Enhancement[]
  members?: Unit[]
}
const props = defineProps<{ data: Unit[] }>()
function unitPrice(item: Unit) {
  const offers = item.offers?.filter(item => item.price)
  const offer = minBy(offers, 'price')
  const quantity = item.quantity ?? 1
  return Math.ceil(offer?.price ?? 0) * Math.ceil((item.models * quantity) / (offer?.eligibleQuantity ?? 1))
}
const totals = computed(() => {
  const quantity = props.data.reduce((sum, item) => sum + (item.quantity ?? 1), 0)
  const models = props.data.reduce((sum, item) => sum + (item.models * (item.quantity ?? 1)), 0)
  const unitPoints = props.data.reduce((sum, item) => sum + (item.points * (item.quantity ?? 1)), 0)
  const enhancementPoints = props.data.reduce((sum, item) => sum + sumBy(item.enhancements, 'points'), 0) ?? 0
  const points = unitPoints + enhancementPoints
  return {
    quantity,
    models,
    points
  }
})

const _data = computed(() => {
  return props.data.map(item => item.quantity ? [...Array(item.quantity)].map(() => item) : [item]).flat()
})
</script>

<template>
  <table>
    <thead>
      <tr class="text-left">
        <th class="p-1">
          Name
        </th>
        <!-- <th class="p-1 text-right">
          Quantity
        </th> -->
        <th class="p-1 text-center">
          Models
        </th>
        <th class="p-1 text-center">
          Points
        </th>
        <th class="p-1 text-right">
          Price
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="unit of _data" :key="unit.name">
        <tr>
          <td class="p-1 text-left">
            {{ unit.name }}
          </td>
          <!-- <td class="p-1 text-right">
          {{ unit.quantity }}
        </td> -->
          <td class="p-1 text-right">
            {{ unit.models }}
          </td>
          <td class="p-1 text-right">
            {{ unit.points }}
          </td>
          <td v-if="unit.offers" class="p-1 text-right">
            ${{ unitPrice(unit) }}
          </td>
        </tr>
        <tr v-for="enhancement of (unit.enhancements ?? [])" :key="enhancement.name">
          <td class="p-1 text-left">
            Enhancement: {{ enhancement.name }}
          </td>
          <!-- <td class="p-1 text-right">
            {{ enhancement.quantity }}
          </td> -->
          <td class="p-1 text-right">
            <!-- {{ enhancement.models }} -->
          </td>
          <td class="p-1 text-right">
            {{ enhancement.points }}
          </td>
        </tr>
      </template>
      <tr>
        <td colspan="100%">
          <hr>
        </td>
      </tr>
      <tr class="font-bold">
        <td class="p-1 text-left">
          Total
        </td>
        <!-- <td class="p-1 text-right">
          {{ totals.quantity }}
        </td> -->
        <td class="p-1 text-right">
          {{ totals.models }}
        </td>
        <td class="p-1 text-right">
          {{ totals.points }}
        </td>
        <td class="p-1 text-right">
          ${{ props.data.reduce((sum, item) => sum + (unitPrice(item) ?? 0), 0) }}
        </td>
      </tr>
    </tbody>
  </table>
  <section class="my-5">
    <div v-for="unit of _data" :key="unit.name">
      <div>
        {{ unit.name }} ({{ unit.points }})
      </div>
      <div v-for="weapon of unit.weapons" :key="weapon.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>
        <span>{{ weapon.models ?? unit.models }}x&nbsp;</span>
        <span>{{ weapon.name }}</span>
      </div>
      <div v-for="enhancement of (unit.enhancements ?? [])" :key="enhancement.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>Enhancement:
        {{ enhancement.name }} ({{ enhancement.points }})
      </div>
      <div v-for="member of unit.members" :key="member.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>
        {{ member.name }}
        <div v-for="weapon of member.weapons" :key="weapon.name">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;</span>
          <span>{{ weapon.models ?? member.models ?? unit.models }}x&nbsp;</span>
          <span>{{ weapon.name }}</span>
        </div>
      </div>
      <br>
    </div>
  </section>
</template>
