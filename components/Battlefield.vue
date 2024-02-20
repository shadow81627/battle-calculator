<script setup>
const battleWidth = 44
const battleHeight = 60
const attackerCoordinates = [[0, 0], [0, 0], [0, 0], [0, 0]]
const defenderCoordinates = [[battleHeight - 1, battleWidth - 1], [battleHeight - 1, battleWidth - 1], [battleHeight - 1, battleWidth - 1], [battleHeight - 1, battleWidth - 1]]
</script>

<template>
  <table class="border-collapse">
    <th class="border">
&nbsp;
    </th>
    <th v-for="cell of [...Array(battleWidth).keys()]" :key="cell" class="border" height="24px" width="24px">
      {{ cell + 1 }}
    </th>
    <tbody>
      <tr v-for="row of [...Array(battleHeight).keys()]" :key="row">
        <td class="border text-center" height="24px" width="24px">
          {{ row + 1 }}
        </td>
        <td
          v-for="cell of [...Array(battleWidth).keys()]" :key="cell" class="border" :class="{
            'bg-black': cell === (battleWidth / 2) - 1,
            'bg-yellow': (cell === (battleWidth / 2) - 1) && (row === (battleLength / 2) - 1),
            'bg-cyan': cell === (battleWidth - 1) - 9,
            'bg-pink': cell === (battleWidth - 1) - (9 + 24 + 2),
            'bg-red-500': attackerCoordinates.find(item => item[0] === row && item[1] === cell),
            'bg-blue-500': defenderCoordinates.find(item => item[0] === row && item[1] === cell),
          }" height="24px" width="24px"
        >
          &nbsp;
        </td>
      </tr>
    </tbody>
  </table>
</template>
