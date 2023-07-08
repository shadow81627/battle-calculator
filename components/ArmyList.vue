<script setup lang="ts">
interface Squad {
  name: string
  models: number
  points: number
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
  const offer = item.offers?.find(item => item.price)
  return (offer?.price ?? 0) * Math.ceil(item.models / (offer?.eligibleQuantity ?? 1))
}
</script>

<template>
  <table>
    <thead>
      <tr class="text-left">
        <th class="p-1">
          Name
        </th>
        <th class="p-1 text-right">
          Models
        </th>
        <th class="p-1 text-right">
          Points
        </th>
        <th class="p-1 text-right">
          Price
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of props.data" :key="item.name">
        <td class="p-1 text-left">
          {{ item.name }}
        </td>
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
      <tr>
        <td class="p-1 text-left">
          Total
        </td>
        <td class="p-1 text-right">
          {{ props.data.reduce((sum, item) => sum + item.models, 0) }}
        </td>
        <td class="p-1 text-right">
          {{ props.data.reduce((sum, item) => sum + item.points, 0) }}
        </td>
        <td class="p-1 text-right">
          ${{ props.data.reduce((sum, item) => sum + (squadPrice(item) ?? 0), 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
