<script setup lang="ts">
import { groupBy, startCase } from 'lodash-es'

const route = useRoute()
const { data: lists } = await useAsyncData('lists-index', () => queryContent('lists').find(), {
  transform(data) {
    const items = data.map((item) => {
      const slug = item._path.split('/').slice(-2, -1)
      return { ...item, slug }
    })
    const grouped = groupBy(items, 'slug')
    const entries = Object.entries(grouped)
    const filtered = entries.filter(([slug]) => slug !== 'lists')
    const rows = filtered.map(([slug, items]) => {
      const models = Math.round(items.reduce((sum, item) => sum + (item.models * (item.quantity ?? 1)), 0))
      const points = Math.round(items.reduce((sum, item) => sum + (item.points * (item.quantity ?? 1)), 0))
      const units = Math.round(items.reduce((sum, item) => sum + (item.quantity ?? 1), 0))
      return {
        label: startCase(slug),
        slug,
        models,
        points,
        units,
      }
    })
    return rows
  },
})
</script>

<template>
  <div class="container">
    <h1 class="h2">
      Lists
    </h1>
    <table>
      <thead>
        <th class="p-1 text-left">
          Name
        </th>
        <th class="p-1 text-center">
          Models
        </th>
        <th class="p-1 text-center">
          Units
        </th>
        <th class="p-1 text-center">
          Points
        </th>
      </thead>
      <tbody>
        <tr
          v-for="list of lists"
          :key="list.slug"
        >
          <td class="p-1 text-left">
            <NuxtLink :to="`${route.path}/${list.slug}`">
              {{ list.label }}
            </NuxtLink>
          </td>
          <td class="p-1 text-right">
            {{ list.models }}
          </td>
          <td class="p-1 text-right">
            {{ list.units }}
          </td>
          <td class="p-1 text-right">
            {{ list.points }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
