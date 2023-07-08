<script setup>
const { params } = useRoute()
const id = params.list
const { data } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).findOne())

function squadPrice(item) {
  return item.offers.find(item => item.price).price * Math.ceil(item.models / item.offers.find(item => item.eligibleQuantity).eligibleQuantity ?? 1)
}
</script>

<template>
  <h1 class="h2 text-left">
    {{ data.title }} List
  </h1>
  <table>
    <thead>
      <tr class="text-left">
        <th>
          Name
        </th>
        <th>
          Models
        </th>
        <th>
          Points
        </th>
        <th>
          Price
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of data.body" :key="item.name">
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
          {{ data.body.reduce((sum, item) => sum + item.models, 0) }}
        </td>
        <td class="p-1 text-right">
          {{ data.body.reduce((sum, item) => sum + item.points, 0) }}
        </td>
        <td class="p-1 text-right">
          ${{ data.body.reduce((sum, item) => sum + squadPrice(item) ?? 0, 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
