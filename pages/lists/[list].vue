<script setup>
const { params } = useRoute()
const id = params.list
const { data } = await useAsyncData(`lists-${id}`, () => queryContent('lists', id).findOne())
</script>

<template>
  <h1 class="h2 text-left">
    List: {{ data.title }}
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
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of data.body" :key="item.name">
        <td class="text-left">
          {{ item.name }}
        </td>
        <td class="text-right">
          {{ item.models }}
        </td>
        <td class="text-right">
          {{ item.points }}
        </td>
      </tr>
      <tr>
        <td class="text-left">
          Total
        </td>
        <td class="text-right">
          {{ data.body.reduce((sum, item) => sum + item.models, 0) }}
        </td>
        <td class="text-right">
          {{ data.body.reduce((sum, item) => sum + item.points, 0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
