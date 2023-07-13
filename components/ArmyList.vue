<script setup lang="ts">
import { minBy } from 'lodash-es'

interface Squad {
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
  ]
}
const props = defineProps<{ data: Squad[] }>()
function squadPrice(item: Squad) {
  const offers = item.offers?.filter(item => item.price)
  const offer = minBy(offers, 'price')
  const quantity = item.quantity ?? 1
  return Math.ceil(offer?.price ?? 0) * Math.ceil((item.models * quantity) / (offer?.eligibleQuantity ?? 1))
}
const totals = computed(() => {
  const quantity = props.data.reduce((sum, item) => sum + (item.quantity ?? 1), 0)
  const models = props.data.reduce((sum, item) => sum + (item.models * (item.quantity ?? 1)), 0)
  const points = props.data.reduce((sum, item) => sum + (item.points * (item.quantity ?? 1)), 0)
  return {
    quantity,
    models,
    points
  }
})

const _data = computed(() => {
  return props.data.map(item => item.quantity ? [...Array(item.quantity)].map(()=> item) : [item]).flat()
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
      <tr v-for="item of _data" :key="item.name">
        <td class="p-1 text-left">
          {{ item.name }}
        </td>
        <!-- <td class="p-1 text-right">
          {{ item.quantity }}
        </td> -->
        <td class="p-1 text-right">
            {{ item.models }}
        </td>
        <td class="p-1 text-right">
            {{ item.points }}
        </td>
        <td v-if="item.offers" class="p-1 text-right">
          ${{ squadPrice(item) }}
        </td>
      </tr>
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
          ${{ props.data.reduce((sum, item) => sum + (squadPrice(item) ?? 0), 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
