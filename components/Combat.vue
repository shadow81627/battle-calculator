<script setup>
const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: Number },
  save: { type: Number },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: Number },
  pain: { type: Number },
})

const wound = computed(() => {
  if (props.strength === props.toughness)
    return 4
  if (props.strength > props.toughness) {
    if (props.strength > props.toughness * 2)
      return 2

    return 3
  }
  if (props.strength < props.toughness) {
    if (props.strength < props.toughness / 2)
      return 6

    return 5
  }
})

const dice = {
  sides: 6,
  attack(x) {
    return ((6 - x) + 1) / 6
  },
  defend(x) {
    return (x - 1) / 6
  },
}

const hitTotal = computed(() => Math.floor((props.attack) * dice.attack(props.accuracy)))
const woundTotal = computed(() => Math.floor(hitTotal.value * dice.attack(wound.value)))
const saveTotal = computed(() => Math.floor(woundTotal.value * dice.defend(props.save)))
const damageTotal = computed(() => Math.floor(saveTotal.value * props.damage))
const painTotal = computed(() => Math.floor(damageTotal.value * dice.defend(props.pain)))
</script>

<template>
  <table>
    <thead>
      <tr>
        <th class="p-1">
          <label>Hits</label>
        </th>
        <th class="p-1">
          <label>Wounds</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-1">
          {{ hitTotal }}
        </td>
        <td class="p-1">
          {{ woundTotal }}
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th class="p-1">
          <label>Saves</label>
        </th>
        <th class="p-1">
          <label>Damage</label>
        </th>
        <th class="p-1">
          <label>Feel no Pain</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-if="save" class="p-1">
          {{ saveTotal }}
        </td>
        <td v-if="damage" class="p-1">
          {{ damageTotal }}
        </td>
        <td v-if="pain" class="p-1">
          {{ painTotal }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
