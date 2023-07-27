<script setup lang="ts">
import type Unit from '~/types/unit'

defineProps<{ unit: Unit }>()
</script>

<template>
  <table>
    <thead>
      <th class="p-2">
        #
      </th>
      <th class="p-2 text-left">
        Weapon
      </th>
      <th class="p-2">
        Range
      </th>
      <th class="p-2">
        A
      </th>
      <th class="p-2">
        WS
      </th>
      <th class="p-2">
        S
      </th>
      <th class="p-2">
        AP
      </th>
      <th class="p-2">
        D
      </th>
    </thead>
    <tbody>
      <template v-for="weapon of unit.weapons" :key="weapon.name">
        <tr v-if="!weapon.profiles" xclass="border-b-2 border-dashed">
          <td class="p-2 text-center">
            {{ weapon.models ?? unit.models }}
          </td>
          <td class="p-2">
            {{ weapon.name }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.range }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.attack }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.accuracy }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.strength }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.piercing }}
          </td>
          <td class="p-2 text-center">
            {{ weapon.damage }}
          </td>
        </tr>
        <template v-else>
          <tr v-for="profile of weapon.profiles" :key="profile.name" xclass="border-b-2 border-dashed">
            <td class="p-2 text-center">
              {{ profile.models ?? weapon.models ?? unit.models }}
            </td>
            <td class="p-2">
              {{ profile.name }}
            </td>
            <td class="p-2 text-center">
              {{ profile.range }}
            </td>
            <td class="p-2 text-center">
              {{ profile.attack }}
            </td>
            <td class="p-2 text-center">
              {{ profile.accuracy }}
            </td>
            <td class="p-2 text-center">
              {{ profile.strength }}
            </td>
            <td class="p-2 text-center">
              {{ profile.piercing }}
            </td>
            <td class="p-2 text-center">
              {{ profile.damage }}
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
