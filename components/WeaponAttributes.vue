<script setup lang="ts">
import Unit from '~/types/unit'
defineProps<{unit: Unit}>()
</script>
<template>
  <table>
    <thead>
      <th class="p-2">#</th>
      <th class="p-2 text-left">Weapon</th>
      <th class="p-2">Range</th>
      <th class="p-2">A</th>
      <th class="p-2">WS</th>
      <th class="p-2">S</th>
      <th class="p-2">AP</th>
      <th class="p-2">D</th>
    </thead>
    <tbody>
      <tr v-for="weapon of unit.weapons" :key="weapon.name" xclass="border-b-2 border-dashed">
        <td class="p-2 text-center">{{ weapon.models ?? unit.models }}</td>
        <td class="p-2">{{ weapon.name }}</td>
        <td class="p-2 text-center">{{ weapon.range }}</td>
        <td class="p-2 text-center">{{ weapon.attack }}</td>
        <td class="p-2 text-center">{{ weapon.accuracy }}</td>
        <td class="p-2 text-center">{{ weapon.strength }}</td>
        <td class="p-2 text-center">{{ weapon.piercing }}</td>
        <td class="p-2 text-center">{{ weapon.damage }}</td>
      </tr>
    </tbody>
  </table>
</template>
